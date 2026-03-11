import type { ParseResult, ParsedRow } from './csv-parser';

export async function parseExcelBuffer(buffer: ArrayBuffer): Promise<ParseResult> {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet || worksheet.rowCount < 2) {
    return { headers: [], rows: [], errors: ['No data found in the first worksheet'] };
  }

  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? '').trim();
  });

  const rows: ParsedRow[] = [];
  const errors: string[] = [];

  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const rowData: ParsedRow = {};
    let hasData = false;

    headers.forEach((header, idx) => {
      const cell = row.getCell(idx + 1);
      const value = cell.value;

      if (value !== null && value !== undefined && value !== '') {
        hasData = true;
      }

      if (value instanceof Date) {
        rowData[header] = value.toISOString().split('T')[0];
      } else {
        rowData[header] = String(value ?? '');
      }
    });

    if (hasData) {
      rows.push(rowData);
    }
  }

  return { headers: headers.filter(Boolean), rows, errors };
}
