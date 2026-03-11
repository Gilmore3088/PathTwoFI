import { ImportWizard } from "@/components/wealthboard/import-wizard";

export default function ImportPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV or Excel file to bulk-import wealth snapshots.
        </p>
      </div>
      <ImportWizard />
    </div>
  );
}
