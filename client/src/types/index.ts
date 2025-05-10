export interface FileData {
  fileName: string;
  fileSize: string;
  fileType: string;
  lastModified: string;
  parsedData: any;
  columns?: string[];
  rows?: any[][];
  stats?: {
    entries: number;
    fields: number;
    quality: string;
  };
  dataDistribution?: Record<string, string>;
}
