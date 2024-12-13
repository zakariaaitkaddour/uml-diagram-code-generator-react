import React from 'react';
import DiagramMap from './components/DiagramMap';

function App() {
  return (
    <div style={{ marginTop: -45, backgroundColor: '#E4FCFF'}}>
      <h1 style={{marginTop: 50, padding: 20,marginLeft:0, backgroundColor: '#FFFEBC',width: '97%' }}>UML Class Diagram Editor</h1>
      <DiagramMap />
    </div>
  );
}

export default App;
