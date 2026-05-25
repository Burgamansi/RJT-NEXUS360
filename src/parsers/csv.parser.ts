import Papa from "papaparse";

export async function parseCSV(buffer: Buffer): Promise<any[]> {
  const csvContent = buffer.toString("utf8");
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error: any) => reject(error),
    });
  });
}
