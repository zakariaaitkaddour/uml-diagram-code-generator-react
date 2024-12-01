import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClass, addAttribute } from '../store/diagramSlice';

function DiagramEditor() {
  const [className, setClassName] = useState('');
  const [newAttribute, setNewAttribute] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const classes = useSelector(state => state.diagram.classes);
  const dispatch = useDispatch();

  const handleAddClass = () => {
    if (className) {
      dispatch(addClass({ id: Date.now().toString(), name: className, attributes: [] }));
      setClassName('');
    }
  };

  const handleAddAttribute = () => {
    if (selectedClassId && newAttribute) {
      dispatch(addAttribute({ classId: selectedClassId, attribute: newAttribute }));
      setNewAttribute('');
    }
  };

  return (
    <div>
      <h2>Class Diagram Editor</h2>
      
      {/* Add New Class */}
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Class Name"
      />
      <button onClick={handleAddClass}>Add Class</button>

      {/* Select Class and Add Attribute */}
      <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
        <option value="">Select Class</option>
        {classes.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={newAttribute}
        onChange={(e) => setNewAttribute(e.target.value)}
        placeholder="Attribute"
      />
      <button onClick={handleAddAttribute}>Add Attribute</button>

      {/* Display Class List */}
      <div>
        {classes.map(c => (
          <div key={c.id}>
            <h3>{c.name}</h3>
            <ul>
              {c.attributes.map((attr, index) => (
                <li key={index}>{attr}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiagramEditor;
