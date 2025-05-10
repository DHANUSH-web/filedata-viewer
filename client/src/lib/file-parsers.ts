/**
 * This file is for reference only.
 * The actual file parsing happens on the server side,
 * but this provides types and interfaces for parsed data structures.
 */

import { FileData } from "@/types";

export interface ParsedDataResult {
  success: boolean;
  message: string;
  data: any;
  columns?: string[];
  rows?: any[][];
  stats?: {
    entries: number;
    fields: number;
    quality: string;
  };
  dataDistribution?: Record<string, string>;
}

export interface FileParsingError {
  message: string;
  code: string;
}

export type FileParser = (fileContent: string) => Promise<ParsedDataResult>;

export type FileParserMap = {
  [key: string]: FileParser;
};
