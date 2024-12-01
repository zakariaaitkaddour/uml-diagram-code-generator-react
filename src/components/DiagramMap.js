import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
} from 'react-flow-renderer';

const DiagramMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');

  const addClassNode = () => {
    const className = prompt('Enter class name:');
    if (!className) return;

    const newNode = {
      id: `${Date.now()}`,
      data: { label: className, attributes: [], methods: [] },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: 'customClass',
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const onConnect = useCallback((params) => {
    const associationType = prompt('Select association type: inheritance, aggregation, composition');
    if (!['inheritance', 'aggregation', 'composition'].includes(associationType)) {
      alert('Invalid association type.');
      return;
    }
    const multiplicity = associationType === 'inheritance' ? '' : prompt('Enter multiplicity (e.g., 1..1, 1..*, 0..1):');
    const newEdge = { ...params, label: `${associationType}${multiplicity ? ` (${multiplicity})` : ''}`, type: associationType, multiplicity };
    setEdges((eds) => addEdge(newEdge, eds));
  }, []);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const generateJavaCode = () => {
    let code = '';
    const classMap = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.label;
      return acc;
    }, {});

    nodes.forEach((node) => {
      const { label, attributes, methods } = node.data;

      // Handle inheritance
      const parentClass = edges.find((edge) => edge.target === node.id && edge.type === 'inheritance');
      const inheritancePart = parentClass ? ` extends ${classMap[parentClass.source]}` : '';

      code += `public class ${label}${inheritancePart} {\n`;

      // Add attributes
      attributes.forEach((attr) => {
        code += `    private ${attr.type} ${attr.name};\n`;
      });

      // Add aggregated/composed classes
      edges
        .filter((edge) => edge.target === node.id && (edge.type === 'aggregation' || edge.type === 'composition'))
        .forEach((edge) => {
          const sourceClass = classMap[edge.source];
          const isMultiple = edge.multiplicity?.includes('*');
          const dataType = isMultiple ? `List<${sourceClass}>` : sourceClass;
          code += `    private ${dataType} ${sourceClass.toLowerCase()}s;\n`;
        });

      code += '\n';

      // Add methods
      methods.forEach((method) => {
        code += `    public ${method.type} ${method.name}() {\n        // TODO: Implement method\n    }\n`;
      });

      code += '}\n\n';
    });

    setGeneratedCode(code);
  };

  const ClassNode = ({ id, data }) => {
    const [attribute, setAttribute] = useState('');
    const [attributeType, setAttributeType] = useState('');
    const [method, setMethod] = useState('');
    const [methodType, setMethodType] = useState('');

    const addAttribute = () => {
      if (attribute.trim() && attributeType.trim()) {
        data.attributes.push({ name: attribute.trim(), type: attributeType.trim() });
        setAttribute('');
        setAttributeType('');
      }
    };

    const addMethod = () => {
      if (method.trim() && methodType.trim()) {
        data.methods.push({ name: method.trim(), type: methodType.trim() });
        setMethod('');
        setMethodType('');
      }
    };

    return (
      <div style={{ padding: '10px', border: '1px solid #000', borderRadius: '5px', background: '#f0f0f0', width: '150px' }}>
        <strong>{data.label}</strong>
        <button
          style={{ float: 'right', marginTop: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => deleteNode(id)}
        >
          Delete
        </button>
        <div style={{ borderTop: '1px solid #000', marginTop: '5px', paddingTop: '5px' }}>
          <strong>Attributes</strong>
          <ul style={{ paddingLeft: '10px', margin: '5px 0' }}>
            {data.attributes.map((attr, idx) => (
              <li key={idx}>
                {attr.name} : {attr.type}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Attribute name"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
          />
          <input
            type="text"
            placeholder="Attribute type"
            value={attributeType}
            onChange={(e) => setAttributeType(e.target.value)}
          />
          <button onClick={addAttribute}>Add</button>
        </div>
        <div style={{ borderTop: '1px solid #000', marginTop: '5px', paddingTop: '5px' }}>
          <strong>Methods</strong>
          <ul style={{ paddingLeft: '10px', margin: '5px 0' }}>
            {data.methods.map((meth, idx) => (
              <li key={idx}>
                {meth.name}() : {meth.type}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Method name"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />
          <input
            type="text"
            placeholder="Return type"
            value={methodType}
            onChange={(e) => setMethodType(e.target.value)}
          />
          <button onClick={addMethod}>Add</button>
        </div>
        <Handle type="source" position="right" />
        <Handle type="target" position="left" />
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({
    customClass: ClassNode,
  }), []);

  return (
    <div style={{ height: '100vh' }}>
      <h2>UML Class Diagram Editor</h2>
      <button onClick={addClassNode}>Add Class</button>
      <button onClick={generateJavaCode}>Generate Java Code</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        deleteKeyCode={46}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
        <h3>Generated Java Code:</h3>
        <code>{generatedCode}</code>
      </div>
    </div>
  );
};

export default DiagramMap;
