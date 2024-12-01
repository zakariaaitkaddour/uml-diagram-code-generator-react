import React from 'react';
import { useSelector } from 'react-redux';

function CodeGenerator() {
  const classes = useSelector(state => state.diagram.classes);

  const generateCode = () => {
    return classes.map(c => {
      const classCode = `
public class ${c.name} {
${c.attributes.map(attr => `    private String ${attr};`).join('\n')}
}`;
      return classCode;
    }).join('\n\n');
  };

  return (
    <div>
      <h2>Generated Code</h2>
      <pre>{generateCode()}</pre>
    </div>
  );
}

export default CodeGenerator;
