import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface XmlViewProps {
  data: any;
  expandLevel?: number;
}

const getTagColorClass = (tagName: string): string => {
  if (tagName.startsWith('@_')) {
    return 'text-orange-600'; // Attributes
  }
  
  // Colorize by tag character
  const colorMap: Record<string, string> = {
    a: 'text-blue-700',
    b: 'text-purple-700',
    c: 'text-green-700',
    d: 'text-red-700',
    e: 'text-pink-700',
    f: 'text-indigo-700',
    g: 'text-blue-600',
    h: 'text-green-600',
    i: 'text-amber-700',
    j: 'text-cyan-700',
    k: 'text-blue-700',
    l: 'text-emerald-700',
    m: 'text-violet-700',
    n: 'text-yellow-700',
    o: 'text-teal-700',
    p: 'text-blue-700',
    q: 'text-indigo-600',
    r: 'text-pink-600',
    s: 'text-green-700',
    t: 'text-purple-600',
    u: 'text-blue-700',
    v: 'text-rose-700',
    w: 'text-cyan-700',
    x: 'text-orange-700',
    y: 'text-teal-700',
    z: 'text-indigo-700',
  };
  
  const firstChar = tagName.toLowerCase()[0];
  return colorMap[firstChar] || 'text-purple-700';
};

interface XmlNodeProps {
  tagName: string;
  node: any;
  level: number;
  expandLevel: number;
}

const XmlNode: React.FC<XmlNodeProps> = ({ tagName, node, level, expandLevel }) => {
  const [isExpanded, setIsExpanded] = useState(level < expandLevel);
  const { toast } = useToast();
  
  const isAttribute = tagName.startsWith('@_');
  const normalizedTagName = isAttribute ? tagName.substring(2) : tagName;
  const isTextNode = tagName === '#text';
  const hasChildren = node && typeof node === 'object' && Object.keys(node).length > 0;
  
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    let textToCopy;
    if (typeof node === 'object') {
      // Try to create an XML-like representation for complex nodes
      textToCopy = JSON.stringify(node, null, 2);
    } else {
      textToCopy = String(node);
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: `${normalizedTagName} copied to clipboard`,
      duration: 2000,
    });
  };
  
  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };
  
  if (isTextNode) {
    if (typeof node === 'string' && node.trim() === '') {
      return null; // Skip empty text nodes
    }
    return (
      <div className="text-gray-900 pl-6 py-1">{node}</div>
    );
  }
  
  if (isAttribute) {
    return (
      <div className="flex items-center py-1">
        <span className="text-orange-600">{normalizedTagName}</span>
        <span className="mx-1 text-gray-700">=</span>
        <span className="text-green-600">"{node}"</span>
      </div>
    );
  }
  
  // For elements with simple text content
  if (node && typeof node !== 'object') {
    return (
      <div className="flex items-start py-1">
        <div className="mr-1 w-4">&nbsp;</div>
        <div>
          <span className={getTagColorClass(tagName)}>&lt;{tagName}&gt;</span>
          <span className="text-gray-900 mx-1">{node}</span>
          <span className={getTagColorClass(tagName)}>&lt;/{tagName}&gt;</span>
        </div>
        <div 
          className="ml-2 opacity-0 hover:opacity-100 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
        </div>
      </div>
    );
  }
  
  // Extract attributes and child elements
  const attributes: Record<string, any> = {};
  const children: Record<string, any> = {};
  
  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => {
      if (key.startsWith('@_')) {
        attributes[key] = value;
      } else {
        children[key] = value;
      }
    });
  }
  
  const hasAttributes = Object.keys(attributes).length > 0;
  const hasChildElements = Object.keys(children).length > 0;
  
  return (
    <div className="py-1">
      <div className="flex items-start">
        <div 
          className="mr-1 cursor-pointer" 
          onClick={toggleExpand}
        >
          {(hasAttributes || hasChildElements) ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <span className="w-4 inline-block">&nbsp;</span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <span className={cn("font-medium", getTagColorClass(tagName))}>
              &lt;{tagName}
            </span>
            
            {hasAttributes && isExpanded && (
              <span className="text-gray-500">{' '}...{' '}</span>
            )}
            
            {hasAttributes && !isExpanded && (
              <>
                {Object.entries(attributes).map(([attrName, attrValue], index) => (
                  <React.Fragment key={attrName}>
                    {' '}
                    <span className="text-orange-600">{attrName.substring(2)}</span>
                    <span className="text-gray-700">=</span>
                    <span className="text-green-600">"{attrValue}"</span>
                  </React.Fragment>
                ))}
              </>
            )}
            
            {!hasChildElements ? (
              <span className={getTagColorClass(tagName)}>/&gt;</span>
            ) : (
              <span className={getTagColorClass(tagName)}>&gt;</span>
            )}
          </div>
          
          {isExpanded && (
            <div className="pl-4 border-l border-gray-200 ml-2">
              {/* Display attributes first */}
              {hasAttributes && (
                Object.entries(attributes).map(([attrName, attrValue]) => (
                  <XmlNode 
                    key={attrName}
                    tagName={attrName}
                    node={attrValue}
                    level={level + 1}
                    expandLevel={expandLevel}
                  />
                ))
              )}
              
              {/* Display child elements */}
              {hasChildElements && (
                Object.entries(children).map(([childTagName, childNode]) => {
                  if (Array.isArray(childNode)) {
                    return childNode.map((item, index) => (
                      <XmlNode 
                        key={`${childTagName}-${index}`}
                        tagName={childTagName}
                        node={item}
                        level={level + 1}
                        expandLevel={expandLevel}
                      />
                    ));
                  }
                  return (
                    <XmlNode 
                      key={childTagName}
                      tagName={childTagName}
                      node={childNode}
                      level={level + 1}
                      expandLevel={expandLevel}
                    />
                  );
                })
              )}
            </div>
          )}
          
          {hasChildElements && isExpanded && (
            <span className={getTagColorClass(tagName)}>&lt;/{tagName}&gt;</span>
          )}
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

export const InteractiveXmlView: React.FC<XmlViewProps> = ({ data, expandLevel = 1 }) => {
  // Find the root element
  let rootTag = 'root';
  let rootNode = data;
  
  // For XMLParser output which might put the root under "root" key
  if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      rootTag = keys[0];
      rootNode = data[rootTag];
    }
  }
  
  return (
    <div className="bg-white rounded-md p-4 overflow-auto font-mono text-sm">
      <XmlNode
        tagName={rootTag}
        node={rootNode}
        level={0}
        expandLevel={expandLevel}
      />
    </div>
  );
};

export default InteractiveXmlView;