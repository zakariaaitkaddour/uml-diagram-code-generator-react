import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';

const ClassNode = ({ id, data, setNodes, setEdges }) => {
  const [attribute, setAttribute] = useState('');
  const [attributeType, setAttributeType] = useState('');
  const [attributeAccess, setAttributeAccess] = useState('');
  const [method, setMethod] = useState('');
  const [methodType, setMethodType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempAttributes, setTempAttributes] = useState([...data.attributes]);
  const [tempMethods, setTempMethods] = useState([...data.methods]);
  const [tempAccess, setTempAccess] = useState([...data.access]);

  const typesAttributes = ['int', 'string', 'double', 'boolean']; 
  const typesMethods = ['int', 'string', 'double', 'boolean', "void"];
  const AccessModifiers = ['protected', 'private', 'public'];


  const addAttribute = () => {
    if (attribute && attributeType && attributeAccess) {
      data.attributes.push({ name: attribute, access: attributeAccess ,type: attributeType });
      setAttribute('');
      setAttributeType('');
    }
  };

  // const addAccess = () => {
  //   if (attribute) {
  //     data.access.push({name: access});
  //     setAccess('');
  //   }
  // };

  const addMethod = () => {
    if (method && methodType) {
      data.methods.push({ name: method, type: methodType });
      setMethod('');
      setMethodType('');
    }
  };

  // To delete a node
  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setTempAttributes([...data.attributes]);
    setTempMethods([...data.methods]);
    setIsEditing(!isEditing);
  };

  // Save changes
  const saveChanges = () => {
    data.attributes = [...tempAttributes];
    data.methods = [...tempMethods];
    setIsEditing(false);
  };

  // Update temporary attributes
  const updateAttribute = (index, key, value) => {
    const updatedAttributes = [...tempAttributes];
    updatedAttributes[index][key] = value;
    setTempAttributes(updatedAttributes);
  };

  // Update temporary methods
  const updateMethod = (index, key, value) => {
    const updatedMethods = [...tempMethods];
    updatedMethods[index][key] = value;
    setTempMethods(updatedMethods);
  };

  // Render the edit modal
  const renderEditModal = () => (
    <div style={{
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      background: '#fff', 
      border: '1px solid #ccc', 
      padding: '20px', 
      zIndex: 10 
    }}>
      <h4>Edit Attributes</h4>
      {tempAttributes.map((attr, idx) => (
        <div key={idx}>
          <input
            value={attr.name}
            onChange={(e) => updateAttribute(idx, 'name', e.target.value)}
            placeholder="Name"
          />
          <select
            value={attr.type}
            onChange={(e) => updateAttribute(idx, 'type', e.target.value)}
          >
            {typesAttributes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      ))}
      <h4>Edit Methods</h4>
      {tempMethods.map((meth, idx) => (
        <div key={idx}>
          <input
            value={meth.name}
            onChange={(e) => updateMethod(idx, 'name', e.target.value)}
            placeholder="Name"
          />
          <select
            value={meth.type}
            onChange={(e) => updateMethod(idx, 'type', e.target.value)}
          >
            {typesMethods.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={saveChanges}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  );

  return (
    <div style={{ padding: 15, border: '1px solid #000', borderRadius: '5px', background: '#f0f0f0', width: '200px', marginTop: -20 }}>
      <h2>{data.label}</h2>
      <button
            style={{ float: 'right', marginTop: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => deleteNode(id)} >
            Delete
      </button>
      <button
            style={{ float: 'right', marginTop: '-5px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            onClick={toggleEdit} >
            Edit
      </button>
      
      {isEditing && renderEditModal()}
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
      <div style={{marginBottom: 10}}>
        <strong>Attributes</strong>
        <ul>
          {data.attributes.map((attr, idx) => (
            <li key={idx}>{attr.access} {attr.name} : {attr.type}</li>
          ))}
        </ul>
        <select
          value={attributeType}
          onChange={(e) => setAttributeAccess(e.target.value)}
        >
          <option value="" disabled>Select Access:</option>
          {AccessModifiers.map((acc, idx) => (
            <option key={idx} value={acc}>{acc}</option>
          ))}
        </select>
        
        <input
          placeholder="Attribute Name"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        />
        <select
          value={attributeType}
          onChange={(e) => setAttributeType(e.target.value)}
        >
        <option value="" disabled>Select Type</option>
        {typesAttributes.map((type, idx) => (
        <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={addAttribute}>Add</button>
      </div>
      <div>
        <strong>Methods</strong>
        <ul>
          {data.methods.map((meth, idx) => (
            <li key={idx}>{meth.name}() : {meth.type}</li>
          ))}
        </ul>
        <input
          placeholder="Method Name"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <select
          value={methodType}
          onChange={(e) => setMethodType(e.target.value)}
        >
          <option value="" disabled>Select Type</option>
          {typesMethods.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={addMethod}>Add</button>
      </div>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default ClassNode;