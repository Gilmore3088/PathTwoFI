import { BalanceSheetImport } from '@/components/wealthboard/balance-sheet-import';

export default function BalanceSheetImportPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Import Balance Sheet</h1>
        <p className="text-muted-foreground mt-2">
          Upload your Excel balance sheet. Reads Combined, His, and Her tabs automatically.
        </p>
      </div>
      <BalanceSheetImport />
    </div>
  );
}
