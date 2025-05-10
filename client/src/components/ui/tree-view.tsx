import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type TreeItemType = {
  key: string;
  value: any;
  type: string;
  children?: TreeItemType[];
};

interface TreeViewProps {
  data: any;
  fileType: 'json' | 'xml';
}

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isArray(value: any): boolean {
  return Array.isArray(value);
}

const TreeNodeLabel = ({ label, type, value, fileType }: { label: string; type: string; value: any; fileType: 'json' | 'xml' }) => {
  const isXml = fileType === 'xml';
  
  if (type === 'primitive') {
    if (isXml) {
      return (
        <>
          <span className="text-accent">&lt;{label}&gt;</span>
          <span className="text-gray-800">{String(value)}</span>
          <span className="text-accent">&lt;/{label}&gt;</span>
        </>
      );
    }
    return (
      <>
        <span className="text-blue-600">{label}:</span> <span className="text-gray-800">{JSON.stringify(value)}</span>
      </>
    );
  }
  
  if (isXml) {
    return (
      <span className={cn("font-semibold text-accent", {
        "font-bold": label === "xml" || label === "root"
      })}>
        &lt;{label}&gt;
      </span>
    );
  }
  
  return (
    <>
      <span className={cn("font-semibold", {
        "text-primary": isObject(value),
        "text-gray-800": isArray(value)
      })}>
        {label}
      </span>
      <span className="text-gray-500">
        {isArray(value) ? " (Array)" : " (Object)"}
      </span>
    </>
  );
};

const TreeNode = ({ item, depth = 0, fileType }: { item: TreeItemType; depth?: number; fileType: 'json' | 'xml' }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="tree-item" style={{ marginLeft: depth > 0 ? '1.5rem' : 0 }}>
      <div className="flex items-start">
        {hasChildren && (
          <button 
            onClick={toggleExpand}
            className="flex-shrink-0 mr-1 focus:outline-none transform transition-transform"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {!hasChildren && <span className="w-4 mr-1"></span>}
        
        <span>
          <TreeNodeLabel 
            label={item.key} 
            type={item.type} 
            value={item.value}
            fileType={fileType}
          />
        </span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children!.map((child, index) => (
            <TreeNode 
              key={`${child.key}-${index}`} 
              item={child} 
              depth={depth + 1}
              fileType={fileType}
            />
          ))}
        </div>
      )}
      
      {fileType === 'xml' && item.type !== 'primitive' && hasChildren && (
        <div style={{ marginLeft: depth > 0 ? '1.5rem' : 0 }} className="mt-1">
          <span className="font-semibold text-accent">&lt;/{item.key}&gt;</span>
        </div>
      )}
    </div>
  );
};

export default function TreeView({ data, fileType }: TreeViewProps) {
  // Process JSON data for visualization
  const processData = (data: any, parentKey = 'root'): TreeItemType => {
    if (data === null || data === undefined) {
      return { key: parentKey, value: 'null', type: 'primitive' };
    }
    
    if (typeof data !== 'object') {
      return { key: parentKey, value: data, type: 'primitive' };
    }
    
    const children: TreeItemType[] = [];
    
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        children.push(processData(item, String(index)));
      });
      return {
        key: parentKey,
        value: data,
        type: 'array',
        children
      };
    }
    
    // Object case
    Object.entries(data).forEach(([key, value]) => {
      children.push(processData(value, key));
    });
    
    return {
      key: parentKey,
      value: data,
      type: 'object',
      children
    };
  };
  
  const processedData = processData(data);
  
  return (
    <div className="tree-view">
      <TreeNode item={processedData} fileType={fileType} />
    </div>
  );
}
