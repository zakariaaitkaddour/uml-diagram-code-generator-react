export const generateJavaCode = (nodes, edges) => {
    let code = '';
  
    // Map nodes by their ID for quick lookup
    const classMap = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.label;
      return acc;
    }, {});
  
    // Iterate through each node to generate class definitions
    nodes.forEach((node) => {
      const { label, attributes, methods } = node.data;
  
      // Handle inheritance (target node is the child class)
      const parentEdge = edges.find((edge) => edge.target === node.id && edge.type === 'inheritance');
      const parentClass = parentEdge ? classMap[parentEdge.source] : null;
      const inheritancePart = parentClass ? ` extends ${parentClass}` : '';
  
      // Start class definition
      code += `public class ${label}${inheritancePart} {\n`;
  
      // Add attributes
      attributes.forEach((attr) => {
        code += `    ${attr.access} ${attr.type} ${attr.name};\n`;
      });
  
      // Handle aggregation and composition (source node is the parent class)
      edges
        .filter((edge) => edge.target === node.id && (edge.type === 'aggregation' || edge.type === 'composition'))
        .forEach((edge) => {
          const relatedClass = classMap[edge.source];
          const isMultiple = edge.multiplicity?.includes('*');
          const dataType = isMultiple ? `List<${relatedClass}>` : relatedClass;
          code += `    private ${dataType} ${relatedClass.toLowerCase()}s;\n`;
        });
  
      code += '\n';
  
      // Add methods
      methods.forEach((method) => {
        code += `    public ${method.type} ${method.name}() {\n        // TODO: Implement method\n    }\n`;
      });
  
      // End class definition
      code += '}\n\n';
    });
  
    return code; // Return the generated code as a string
  };

  export const generatePythonCode = (nodes, edges) => {
    let code = '';
  
    nodes.forEach((node) => {
      if (!node.data || !node.data.label) {
        console.error(`Node data or label is missing for node:`, node);
        return;
      }
  
      code += `class ${node.data.label}:\n`;
      code += '    def __init__(self';
      if (node.data.attributes) {
        node.data.attributes.forEach((attr) => {
          if (attr.name && attr.type) {
            code += `, ${attr.name}: ${attr.type}`;
          }
        });
      }
      code += '):\n';
      if (node.data.attributes) {
        node.data.attributes.forEach((attr) => {
          if (attr.name) {
            code += `        self.${attr.name} = ${attr.name}\n`;
          }
        });
      }
      code += '\n';
      if (node.data.methods) {
        node.data.methods.forEach((method) => {
          if (method.name && method.type) {
            code += `    def ${method.name}(self) -> ${method.type}:\n`;
            code += '        pass\n\n';
          }
        });
      }
    });
  
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
  
      if (!sourceNode || !targetNode) {
        console.error(`Edge source or target node not found:`, edge);
        return;
      }
  
      if (edge.type === 'inheritance') {
        if (targetNode.data && sourceNode.data) {
          code = code.replace(
            `class ${targetNode.data.label}:\n`,
            `class ${targetNode.data.label}(${sourceNode.data.label}):\n`
          );
        }
      } else if (edge.type === 'aggregation') {
        if (targetNode.data && sourceNode.data) {
          code = code.replace(
            `class ${targetNode.data.label}:\n`,
            `class ${targetNode.data.label}:\n    def __init__(self, ${sourceNode.data.label.toLowerCase()}: ${sourceNode.data.label}):\n        self.${sourceNode.data.label.toLowerCase()} = ${sourceNode.data.label.toLowerCase()}\n\n`
          );
        }
      } else if (edge.type === 'composition') {
        if (targetNode.data && sourceNode.data) {
          code = code.replace(
            `class ${targetNode.data.label}:\n`,
            `class ${targetNode.data.label}:\n    def __init__(self):\n        self.${sourceNode.data.label.toLowerCase()} = ${sourceNode.data.label}()\n\n`
          );
        }
      }
    });
  
    return code;
  };
  
  
  
  export const generatePhpCode = (nodes, edges) => {
    let code = '';
  
    nodes.forEach((node) => {
      code += `class ${node.data.label} {\n`;
      node.data.attributes.forEach((attr) => {
        code += `    ${attr.access} $${attr.name};\n`;
      });
      code += '\n    public function __construct(';
      code += node.data.attributes
        .map((attr) => `$${attr.name}`)
        .join(', ');
      code += `) {\n`;
      node.data.attributes.forEach((attr) => {
        code += `        $this->${attr.name} = $${attr.name};\n`;
      });
      code += '    }\n\n';
      node.data.methods.forEach((method) => {
        code += `    public function ${method.name}(): ${method.type} {\n`;
        code += '        // TODO: Implement method\n';
        code += '    }\n\n';
      });
      code += '}\n\n';
    });
  
    // Handle associations for PHP
    edges.forEach((edge) => {
      if (edge.type === 'inheritance') {
        code = code.replace(
          `class ${edge.target.data.label} {\n`,
          `class ${edge.target.data.label} extends ${edge.source.data.label} {\n`
        );
      }
      // Handle other edge types as needed
    });
  
    return code;
  };

  export const downloadCode = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  