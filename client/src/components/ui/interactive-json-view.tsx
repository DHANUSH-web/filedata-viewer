import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonViewProps {
  data: any;
  expandLevel?: number;
}

const getType = (value: any): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const getPreviewString = (value: any, type: string): string => {
  if (type === 'null') return 'null';
  if (type === 'undefined') return 'undefined';
  if (type === 'string') return `"${value}"`;
  if (type === 'function') return 'function() {...}';
  if (type === 'object' || type === 'array') {
    if (type === 'array') {
      return `Array(${value.length})`;
    }
    const keys = Object.keys(value);
    return `{${keys.length > 0 ? ' ... ' : ''}}`;
  }
  return String(value);
};

interface JsonNodeProps {
  name: string | null;
  value: any;
  level: number;
  expandLevel: number;
  isLast: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({ name, value, level, expandLevel, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(level < expandLevel);
  const { toast } = useToast();
  
  const type = getType(value);
  const isExpandable = type === 'object' || type === 'array';
  
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = JSON.stringify(value, null, 2);
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: `${name ? name : 'Value'} copied to clipboard`,
      duration: 2000,
    });
  };
  
  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const getPrimitiveValue = () => {
    switch (type) {
      case 'string':
        return <span className="text-green-600">{getPreviewString(value, type)}</span>;
      case 'number':
        return <span className="text-blue-600">{value}</span>;
      case 'boolean':
        return <span className="text-orange-600">{String(value)}</span>;
      case 'null':
        return <span className="text-gray-500">null</span>;
      case 'undefined':
        return <span className="text-gray-500">undefined</span>;
      default:
        return <span className="text-gray-700">{getPreviewString(value, type)}</span>;
    }
  };
  
  const renderNode = () => {
    if (!isExpandable) {
      return getPrimitiveValue();
    }
    
    if (!isExpanded) {
      return (
        <span className="text-gray-500 cursor-pointer" onClick={toggleExpand}>
          {getPreviewString(value, type)}
        </span>
      );
    }
    
    if (type === 'array') {
      return (
        <>
          <span className="text-gray-600">[</span>
          {value.length === 0 && <span className="text-gray-500">empty</span>}
          {value.length > 0 && (
            <div className="pl-4 border-l border-gray-200">
              {value.map((item: any, index: number) => (
                <div key={index} className="flex items-start py-1">
                  <JsonNode
                    name={String(index)}
                    value={item}
                    level={level + 1}
                    expandLevel={expandLevel}
                    isLast={index === value.length - 1}
                  />
                </div>
              ))}
            </div>
          )}
          <span className="text-gray-600">]</span>
        </>
      );
    }
    
    // Object
    const entries = Object.entries(value);
    return (
      <>
        <span className="text-gray-600">{'{'}</span>
        {entries.length === 0 && <span className="text-gray-500">empty</span>}
        {entries.length > 0 && (
          <div className="pl-4 border-l border-gray-200">
            {entries.map(([key, val], index) => (
              <div key={key} className="flex items-start py-1">
                <JsonNode
                  name={key}
                  value={val}
                  level={level + 1}
                  expandLevel={expandLevel}
                  isLast={index === entries.length - 1}
                />
              </div>
            ))}
          </div>
        )}
        <span className="text-gray-600">{'}'}</span>
      </>
    );
  };
  
  return (
    <div className={cn("flex-1 font-mono text-sm")} style={{ overflow: 'visible' }}>
      <div className="flex items-start">
        <div className="mr-1 cursor-pointer" onClick={toggleExpand}>
          {isExpandable ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <span className="w-4 h-4 inline-block"></span>
          )}
        </div>
        
        <div className="flex-1">
          {name !== null && (
            <>
              <span className="text-purple-600 font-medium">{name}</span>
              <span className="text-gray-600 mx-1">:</span>
            </>
          )}
          
          {renderNode()}
        </div>
        
        <div 
          className="ml-2 opacity-0 hover:opacity-100 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export const InteractiveJsonView: React.FC<JsonViewProps> = ({ data, expandLevel = 1 }) => {
  return (
    <div className="bg-white rounded-md p-4 overflow-auto font-mono text-sm">
      <JsonNode
        name={null}
        value={data}
        level={0}
        expandLevel={expandLevel}
        isLast={true}
      />
    </div>
  );
};

export default InteractiveJsonView;