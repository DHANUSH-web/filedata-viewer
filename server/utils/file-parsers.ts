import { XMLParser } from 'fast-xml-parser';
import xlsx from 'xlsx';

interface ParsedDataResult {
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
  fileId?: number;
}

// Parse JSON file
export async function parseJsonFile(fileBuffer: Buffer): Promise<ParsedDataResult> {
  try {
    const content = fileBuffer.toString('utf8');
    const data = JSON.parse(content);
    
    // Calculate statistics
    const stats = calculateJsonStats(data);
    const dataDistribution = calculateJsonDistribution(data);
    
    return {
      success: true,
      message: "JSON file parsed successfully",
      data,
      stats,
      dataDistribution
    };
  } catch (error: any) {
    throw new Error(`Failed to parse JSON file: ${error.message}`);
  }
}

// Parse XML file
export async function parseXmlFile(fileBuffer: Buffer): Promise<ParsedDataResult> {
  try {
    const content = fileBuffer.toString('utf8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      preserveOrder: true
    });
    
    const data = parser.parse(content);
    
    // Calculate statistics
    const stats = calculateXmlStats(data);
    const dataDistribution = calculateXmlDistribution(data);
    
    return {
      success: true,
      message: "XML file parsed successfully",
      data,
      stats,
      dataDistribution
    };
  } catch (error: any) {
    throw new Error(`Failed to parse XML file: ${error.message}`);
  }
}

// Parse Excel file
export async function parseExcelFile(fileBuffer: Buffer): Promise<ParsedDataResult> {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert Excel sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Extract columns (first row) and rows (remaining data)
    const columns = jsonData[0] as string[];
    const rows = jsonData.slice(1) as any[][];
    
    // Calculate statistics
    const stats = calculateExcelStats(jsonData);
    const dataDistribution = calculateExcelDistribution(jsonData);
    
    return {
      success: true,
      message: "Excel file parsed successfully",
      data: jsonData,
      columns,
      rows,
      stats,
      dataDistribution
    };
  } catch (error: any) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

// Helper functions for statistics calculation

function calculateJsonStats(data: any): { entries: number; fields: number; quality: string } {
  let entries = 0;
  let fields = 0;
  
  // Handle common JSON structures
  if (Array.isArray(data)) {
    entries = data.length;
    if (entries > 0 && typeof data[0] === 'object') {
      fields = Object.keys(data[0]).length;
    }
  } else if (typeof data === 'object' && data !== null) {
    // Look for arrays in the first level
    for (const key in data) {
      if (Array.isArray(data[key])) {
        entries = data[key].length;
        if (entries > 0 && typeof data[key][0] === 'object') {
          fields = Object.keys(data[key][0]).length;
        }
        break;
      }
    }
    
    // If no arrays found, count the object's own fields
    if (entries === 0) {
      entries = 1;
      fields = Object.keys(data).length;
    }
  }
  
  // Calculate a mock quality score (in a real app, would be based on actual data validation)
  const quality = `${Math.min(98, 90 + Math.floor(Math.random() * 9))}%`;
  
  return { entries, fields, quality };
}

function calculateXmlStats(data: any): { entries: number; fields: number; quality: string } {
  // XML stats calculation is similar but adapted for XML structure
  let entries = 0;
  let fields = 0;
  
  // Find the first array in the parsed XML data
  const findEntryArray = (obj: any): any[] | null => {
    if (Array.isArray(obj)) {
      return obj;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const result = findEntryArray(obj[key]);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  const entryArray = findEntryArray(data);
  
  if (entryArray) {
    entries = entryArray.length;
    if (entries > 0 && typeof entryArray[0] === 'object') {
      fields = Object.keys(entryArray[0]).length;
    }
  } else {
    // If no arrays found, count the top-level elements
    entries = 1;
    fields = Object.keys(data).length;
  }
  
  const quality = `${Math.min(98, 90 + Math.floor(Math.random() * 9))}%`;
  
  return { entries, fields, quality };
}

function calculateExcelStats(data: any[]): { entries: number; fields: number; quality: string } {
  const entries = data.length > 1 ? data.length - 1 : 0; // Subtract header row
  const fields = data[0]?.length || 0;
  
  // Calculate a mock quality score
  const quality = `${Math.min(98, 90 + Math.floor(Math.random() * 9))}%`;
  
  return { entries, fields, quality };
}

function calculateJsonDistribution(data: any): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Find data categories
  let categoriesField = '';
  let categoriesData: any[] = [];
  
  if (Array.isArray(data)) {
    categoriesData = data;
    // Try to find a category field
    if (data.length > 0 && typeof data[0] === 'object') {
      const possibleFields = ['category', 'type', 'class', 'classification'];
      for (const field of possibleFields) {
        if (data[0][field]) {
          categoriesField = field;
          break;
        }
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    // Look for arrays in the first level
    for (const key in data) {
      if (Array.isArray(data[key])) {
        categoriesData = data[key];
        
        // Try to find a category field
        if (categoriesData.length > 0 && typeof categoriesData[0] === 'object') {
          const possibleFields = ['category', 'type', 'class', 'classification'];
          for (const field of possibleFields) {
            if (categoriesData[0][field]) {
              categoriesField = field;
              break;
            }
          }
        }
        break;
      }
    }
  }
  
  if (categoriesField && categoriesData.length > 0) {
    // Count occurrences of each category
    const counts: Record<string, number> = {};
    let total = 0;
    
    categoriesData.forEach(item => {
      if (item[categoriesField]) {
        const category = item[categoriesField];
        counts[category] = (counts[category] || 0) + 1;
        total++;
      }
    });
    
    // Convert to percentages
    Object.keys(counts).forEach(category => {
      const percentage = Math.round((counts[category] / total) * 100);
      result[category] = `${percentage}%`;
    });
  } else {
    // If no category field found, use generic categories
    result['Category 1'] = '40%';
    result['Category 2'] = '30%';
    result['Category 3'] = '20%';
    result['Other'] = '10%';
  }
  
  return result;
}

function calculateXmlDistribution(data: any): Record<string, string> {
  // Similar implementation to JSON but adapted for XML structure
  // For simplicity, we'll return mock data
  return {
    'Category 1': '40%',
    'Category 2': '30%',
    'Category 3': '20%',
    'Other': '10%'
  };
}

function calculateExcelDistribution(data: any[]): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Try to find a category column
  let categoryColumnIndex = -1;
  const possibleColumnNames = ['category', 'type', 'class', 'classification'];
  
  if (data.length > 0) {
    const headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]?.toString().toLowerCase();
      if (header && possibleColumnNames.includes(header)) {
        categoryColumnIndex = i;
        break;
      }
    }
    
    if (categoryColumnIndex >= 0 && data.length > 1) {
      // Count occurrences of each category
      const counts: Record<string, number> = {};
      let total = 0;
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row && row[categoryColumnIndex]) {
          const category = row[categoryColumnIndex].toString();
          counts[category] = (counts[category] || 0) + 1;
          total++;
        }
      }
      
      // Convert to percentages
      Object.keys(counts).forEach(category => {
        const percentage = Math.round((counts[category] / total) * 100);
        result[category] = `${percentage}%`;
      });
      
      return result;
    }
  }
  
  // If no category column found, use generic categories
  result['Category 1'] = '40%';
  result['Category 2'] = '30%';
  result['Category 3'] = '20%';
  result['Other'] = '10%';
  
  return result;
}
