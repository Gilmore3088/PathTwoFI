'use client';

import { useState, useCallback, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parseCsvText, autoDetectMappings, WEALTH_FIELDS } from '@/lib/csv-parser';
import type { ParsedRow } from '@/lib/csv-parser';
import { importWealthData } from '@/app/dashboard/wealthboard/import/actions';
import type { WealthCategory } from '@/types/wealth.types';

type Step = 'upload' | 'map' | 'preview' | 'result';

export function ImportWizard() {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [defaultCategory, setDefaultCategory] = useState<WealthCategory>('Combined');
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<{
    inserted: number;
    updated: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    try {
      if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
        const text = await file.text();
        const result = parseCsvText(text);
        setHeaders(result.headers);
        setRows(result.rows);
        setParseErrors(result.errors);
        setMappings(autoDetectMappings(result.headers));
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const { parseExcelBuffer } = await import('@/lib/excel-parser');
        const buffer = await file.arrayBuffer();
        const result = await parseExcelBuffer(buffer);
        setHeaders(result.headers);
        setRows(result.rows);
        setParseErrors(result.errors);
        setMappings(autoDetectMappings(result.headers));
      } else {
        toast.error('Unsupported file type. Use .csv, .tsv, .xlsx, or .xls');
        return;
      }

      setStep('map');
    } catch {
      toast.error('Failed to parse file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv', '.tsv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  function updateMapping(csvHeader: string, wealthField: string) {
    setMappings((prev) => {
      const next = { ...prev };
      if (wealthField === '_skip') {
        delete next[csvHeader];
      } else {
        next[csvHeader] = wealthField;
      }
      return next;
    });
  }

  function buildMappedRows(): Record<string, string | number>[] {
    return rows.map((row) => {
      const mapped: Record<string, string | number> = {};

      for (const [csvHeader, wealthField] of Object.entries(mappings)) {
        const rawValue = row[csvHeader];
        if (!rawValue && rawValue !== '0') continue;

        if (wealthField === 'date' || wealthField === 'notes' || wealthField === 'category') {
          mapped[wealthField] = rawValue;
        } else {
          const cleaned = rawValue.replace(/[$,\s]/g, '');
          const num = parseFloat(cleaned);
          if (!isNaN(num)) {
            mapped[wealthField] = num;
          }
        }
      }

      if (!mapped.category) {
        mapped.category = defaultCategory;
      }

      return mapped;
    });
  }

  function handleImport() {
    const mappedRows = buildMappedRows();

    const validRows = mappedRows.filter((r) => r.date);
    if (validRows.length === 0) {
      toast.error('No rows have a date mapped. Map a date column first.');
      return;
    }

    startTransition(async () => {
      const result = await importWealthData(
        validRows as { date: string; category: WealthCategory; [key: string]: string | number }[]
      );
      setImportResult(result);
      setStep('result');
      if (result.success) {
        toast.success(`Imported ${result.inserted} entries`);
      } else {
        toast.error('Import completed with errors');
      }
    });
  }

  const previewRows = buildMappedRows().slice(0, 10);
  const mappedFieldKeys = Object.values(mappings);
  const hasDateMapping = mappedFieldKeys.includes('date');

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {(['upload', 'map', 'preview', 'result'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <ArrowRight className="h-3 w-3" />}
            <span className={step === s ? 'text-foreground font-semibold' : ''}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <Card>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .csv, .tsv, .xlsx, .xls
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Map columns */}
      {step === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Map Columns from {fileName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {rows.length} rows and {headers.length} columns.
              {parseErrors.length > 0 && ` ${parseErrors.length} parse warnings.`}
            </p>

            {!hasDateMapping && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 text-destructive" />
                You must map a Date column to proceed.
              </div>
            )}

            <div className="space-y-2">
              <Label>Default Category (when no category column is mapped)</Label>
              <Select
                value={defaultCategory}
                onValueChange={(v) => setDefaultCategory(v as WealthCategory)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Combined">Combined</SelectItem>
                  <SelectItem value="His">His</SelectItem>
                  <SelectItem value="Her">Her</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {headers.map((header) => (
                <div key={header} className="flex items-center justify-between p-3 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{header}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      e.g. {rows[0]?.[header] || '(empty)'}
                    </p>
                  </div>
                  <Select
                    value={mappings[header] || '_skip'}
                    onValueChange={(val) => updateMapping(header, val)}
                  >
                    <SelectTrigger className="w-48 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_skip">-- Skip --</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      {WEALTH_FIELDS.map((f) => (
                        <SelectItem key={f.key} value={f.key}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep('preview')}
                disabled={!hasDateMapping}
              >
                Preview
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview ({rows.length} total rows)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing first {Math.min(10, previewRows.length)} rows. Duplicate dates will be updated (upsert).
            </p>

            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {mappedFieldKeys.map((field) => (
                      <th key={field} className="p-2 text-left font-medium whitespace-nowrap">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      {mappedFieldKeys.map((field) => (
                        <td key={field} className="p-2 whitespace-nowrap">
                          {row[field] !== undefined ? String(row[field]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('map')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleImport} disabled={isPending}>
                {isPending ? 'Importing...' : `Import ${rows.length} Rows`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Result */}
      {step === 'result' && importResult && (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Import Complete</h2>
            <div className="text-muted-foreground space-y-1">
              <p>{importResult.inserted} entries processed</p>
              {importResult.skipped > 0 && (
                <p className="text-destructive">{importResult.skipped} skipped due to errors</p>
              )}
            </div>
            {importResult.errors.length > 0 && (
              <div className="text-left bg-destructive/10 p-4 rounded-lg text-sm space-y-1">
                {importResult.errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('upload');
                  setRows([]);
                  setHeaders([]);
                  setMappings({});
                  setImportResult(null);
                }}
              >
                Import Another
              </Button>
              <Button asChild>
                <a href="/dashboard/wealthboard">View Wealthboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
