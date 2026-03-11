'use client';

import { useState, useCallback, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Check, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { parseBalanceSheet } from '@/lib/balance-sheet-parser';
import type { BalanceSheetResult } from '@/lib/balance-sheet-parser';
import { importWealthData } from '@/app/dashboard/wealthboard/import/actions';
import { formatCurrency } from '@/lib/fire-constants';
import type { WealthCategory } from '@/types/wealth.types';

type Step = 'upload' | 'preview' | 'result';

// Tab name variations to detect
const COMBINED_NAMES = ['combined', 'total', 'summary', 'balance sheet', 'sheet1'];
const HIS_NAMES = ['his', 'james', 'husband', 'him'];
const HER_NAMES = ['her', 'hers', 'nikoly', 'wife'];

function detectCategory(sheetName: string): WealthCategory | null {
  const lower = sheetName.toLowerCase().trim();
  if (HIS_NAMES.some((n) => lower.includes(n))) return 'His';
  if (HER_NAMES.some((n) => lower.includes(n))) return 'Her';
  if (COMBINED_NAMES.some((n) => lower.includes(n))) return 'Combined';
  return null;
}

interface ParsedSheet {
  sheetName: string;
  category: WealthCategory;
  data: BalanceSheetResult;
}

export function BalanceSheetImport() {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [importResult, setImportResult] = useState<{ inserted: number; errors: string[] } | null>(null);
  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const parsed: ParsedSheet[] = [];

      for (const worksheet of workbook.worksheets) {
        const category = detectCategory(worksheet.name);
        if (!category) continue;

        const rows: { label: string; value: string | number }[] = [];

        worksheet.eachRow((row) => {
          const label = String(row.getCell(1).value ?? '').trim();
          const rawValue = row.getCell(2).value;

          let value: string | number = '';
          if (rawValue instanceof Date) {
            value = `${rawValue.getMonth() + 1}/${rawValue.getDate()}/${rawValue.getFullYear() % 100}`;
          } else if (rawValue !== null && rawValue !== undefined) {
            value = String(rawValue);
          }

          if (label || value) {
            rows.push({ label, value });
          }
        });

        const data = parseBalanceSheet(rows);
        parsed.push({ sheetName: worksheet.name, category, data });
      }

      if (parsed.length === 0) {
        toast.error(
          'No matching tabs found. Name your tabs "Combined", "His", and "Her" (or "James"/"Nikoly").'
        );
        return;
      }

      setSheets(parsed);
      setStep('preview');
    } catch (err) {
      toast.error('Failed to parse Excel file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  function handleImport() {
    const rows = sheets.map((sheet) => {
      const d = sheet.category === 'Combined' ? sheet.data.combined
        : sheet.category === 'His' ? sheet.data.his
        : sheet.data.her;

      return {
        date: sheet.data.date,
        category: sheet.category,
        net_worth: d.net_worth || 0,
        investments: d.investments || 0,
        cash: d.cash || 0,
        liabilities: d.liabilities || 0,
        savings_rate: d.savings_rate || 0,
        stocks: d.stocks || 0,
        bonds: d.bonds || 0,
        real_estate: d.real_estate || 0,
        crypto: d.crypto || 0,
        commodities: d.commodities || 0,
        retirement_401k: d.retirement_401k || 0,
        retirement_ira: d.retirement_ira || 0,
        retirement_roth: d.retirement_roth || 0,
        hsa: d.hsa || 0,
        checking_accounts: d.checking_accounts || 0,
        savings_accounts: d.savings_accounts || 0,
        mortgage: d.mortgage || 0,
        credit_cards: d.credit_cards || 0,
        student_loans: d.student_loans || 0,
        auto_loans: d.auto_loans || 0,
        personal_loans: d.personal_loans || 0,
        other_debts: d.other_debts || 0,
        monthly_income: d.monthly_income || 0,
        monthly_expenses: d.monthly_expenses || 0,
        monthly_savings: d.monthly_savings || 0,
      };
    });

    startTransition(async () => {
      const result = await importWealthData(rows as { date: string; category: WealthCategory; [key: string]: string | number }[]);
      setImportResult({ inserted: result.inserted, errors: result.errors });
      setStep('result');
      if (result.success) {
        toast.success('Balance sheet imported');
      } else {
        toast.error('Import had errors');
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
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
                Drop your balance sheet Excel file
              </p>
              <p className="text-sm text-muted-foreground">
                Expects tabs named Combined (or Balance Sheet), His (or James), Her (or Nikoly)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              {fileName} -- {sheets.length} tab{sheets.length !== 1 ? 's' : ''} found
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep('upload'); setSheets([]); }}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={isPending}>
                {isPending ? 'Importing...' : `Import ${sheets.length} Entries`}
              </Button>
            </div>
          </div>

          {sheets.map((sheet) => {
            const d = sheet.category === 'Combined' ? sheet.data.combined
              : sheet.category === 'His' ? sheet.data.his
              : sheet.data.her;

            return (
              <Card key={sheet.sheetName}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {sheet.category} (tab: {sheet.sheetName}) -- {sheet.data.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                    {d.net_worth ? (
                      <div>
                        <p className="text-muted-foreground">Net Worth</p>
                        <p className="font-semibold">{formatCurrency(d.net_worth)}</p>
                      </div>
                    ) : null}
                    {d.cash ? (
                      <div>
                        <p className="text-muted-foreground">Cash</p>
                        <p className="font-semibold">{formatCurrency(d.cash)}</p>
                      </div>
                    ) : null}
                    {d.investments ? (
                      <div>
                        <p className="text-muted-foreground">Investments</p>
                        <p className="font-semibold">{formatCurrency(d.investments)}</p>
                      </div>
                    ) : null}
                    {d.checking_accounts ? (
                      <div>
                        <p className="text-muted-foreground">Checking</p>
                        <p className="font-semibold">{formatCurrency(d.checking_accounts)}</p>
                      </div>
                    ) : null}
                    {d.stocks ? (
                      <div>
                        <p className="text-muted-foreground">Brokerage</p>
                        <p className="font-semibold">{formatCurrency(d.stocks)}</p>
                      </div>
                    ) : null}
                    {d.retirement_401k ? (
                      <div>
                        <p className="text-muted-foreground">Retirement</p>
                        <p className="font-semibold">{formatCurrency(d.retirement_401k)}</p>
                      </div>
                    ) : null}
                    {d.hsa ? (
                      <div>
                        <p className="text-muted-foreground">HSA</p>
                        <p className="font-semibold">{formatCurrency(d.hsa)}</p>
                      </div>
                    ) : null}
                    {d.crypto ? (
                      <div>
                        <p className="text-muted-foreground">Crypto</p>
                        <p className="font-semibold">{formatCurrency(d.crypto)}</p>
                      </div>
                    ) : null}
                    {d.real_estate ? (
                      <div>
                        <p className="text-muted-foreground">Real Estate</p>
                        <p className="font-semibold">{formatCurrency(d.real_estate)}</p>
                      </div>
                    ) : null}
                    {d.commodities ? (
                      <div>
                        <p className="text-muted-foreground">Commodities</p>
                        <p className="font-semibold">{formatCurrency(d.commodities)}</p>
                      </div>
                    ) : null}
                    {d.mortgage ? (
                      <div>
                        <p className="text-muted-foreground">Mortgage</p>
                        <p className="font-semibold text-red-600">{formatCurrency(d.mortgage)}</p>
                      </div>
                    ) : null}
                    {d.credit_cards ? (
                      <div>
                        <p className="text-muted-foreground">Credit Cards</p>
                        <p className="font-semibold text-red-600">{formatCurrency(d.credit_cards)}</p>
                      </div>
                    ) : null}
                    {d.liabilities ? (
                      <div>
                        <p className="text-muted-foreground">Total Liabilities</p>
                        <p className="font-semibold text-red-600">{formatCurrency(d.liabilities)}</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Result */}
      {step === 'result' && importResult && (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Import Complete</h2>
            <p className="text-muted-foreground">
              {importResult.inserted} entries imported
            </p>
            {importResult.errors.length > 0 && (
              <div className="text-left bg-destructive/10 p-4 rounded-lg text-sm space-y-1">
                {importResult.errors.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => { setStep('upload'); setSheets([]); setImportResult(null); }}>
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
