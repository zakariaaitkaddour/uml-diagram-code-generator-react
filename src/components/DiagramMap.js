import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import { Button, Paper, Box, Grid } from '@mui/material';
import ClassDialog from './ClassDialog';
import AssociationDialog from './AssociationDialog';
import ClassNode from './ClassNode';
import { generateJavaCode, generatePhpCode, generatePythonCode } from '../Utils/CodeGenerator';
import { styled } from '@mui/material/styles';

const DiagramMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [generatedJavaCode, setGeneratedJavaCode] = useState('');
  const [generatedPythonCode, setGeneratedPythonCode] = useState('');
  const [generatedPhpCode, setGeneratedPhpCode] = useState('');
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [openAssociationDialog, setOpenAssociationDialog] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [associationDetails, setAssociationDetails] = useState({
    associationType: '',
    multiplicity: '',
    params: null,
  });
  const [showCode, setShowCode] = useState(false);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback((params) => {
    setAssociationDetails((prev) => ({ ...prev, params }));
    setOpenAssociationDialog(true);
  }, []);

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const newNode = {
      id: `${Date.now()}`,
      data: { label: newClassName, access: [],attributes: [], methods: [] },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: 'customClass',
    };
    setNodes((nds) => [...nds, newNode]);
    setNewClassName('');
    setOpenClassDialog(false);
  };

  const handleAddAssociation = () => {
    const { associationType, multiplicity, params } = associationDetails;
    if (!associationType) {
      alert('Please select an association type.');
      return;
    }
    const label = `${associationType}${multiplicity ? ` (${multiplicity})` : ''}`;
    const newEdge = { ...params, label, type: associationType, multiplicity };
    setEdges((eds) => addEdge(newEdge, eds));
    setOpenAssociationDialog(false);
    setAssociationDetails({ associationType: '', multiplicity: '', params: null });
  };

  const handleGenerateJavaCode = () => {
    const code = generateJavaCode(nodes, edges);
    setGeneratedJavaCode(code);
  
  };

  const handleGeneratePythonCode = () => {
    const code = generatePythonCode(nodes, edges);
    setGeneratedPythonCode(code);
   
  };

  const handleGeneratePhpCode = () => {
    const code = generatePhpCode(nodes, edges);
    setGeneratedPhpCode(code);
   
  };

  const downloadJavaCode = () => {
    const blob = new Blob([generatedJavaCode], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diagram.java';
    link.click();
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const nodeTypes = useMemo(
    () => ({
      customClass: (props) => (
        <ClassNode {...props} setNodes={setNodes} setEdges={setEdges} />
      ),
    }),
    [setNodes, setEdges]
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            
              <div
                style={{
                  height: '100vh',
                  width: '700px',
                  marginTop: '30px',
                  marginLeft: '30px',
                }}
              >
                <div style={{ marginBottom: 50 }}>
                  <Button
                    style={{ marginRight: 10 }}
                    variant="contained"
                    color="success"
                    onClick={() => setOpenClassDialog(true)}
                  >
                    Add Class
                  </Button>
                  <Button
                    style={{ marginRight: 10 }}
                    variant="contained"
                    onClick={handleGenerateJavaCode}
                  >
                    Generate Java Code
                  </Button>

                  <Button
                    style={{ marginRight: 10 }}
                    variant="contained"
                    onClick={handleGeneratePythonCode}
                  >
                    Generate Python Code
                  </Button>

                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="contained"
                    onClick={handleGeneratePhpCode}
                  >
                    Generate Php Code
                  </Button>

                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="contained"
                    color="error"
                    onClick={downloadJavaCode}
                  >
                    Download Java Code
                  </Button>

                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="contained"
                    color="error"
                    onClick={downloadJavaCode}
                  >
                    Download Java Code
                  </Button>

                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="contained"
                    color="error"
                    onClick={downloadJavaCode}
                  >
                    Download Java Code
                  </Button>
                </div>
                <ReactFlow
                  style={{ border: '3px solid black' }}
                  nodes={nodes}
                  edges={edges}
                  onConnect={onConnect}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  deleteKeyCode={46}
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
           
          </Grid>
          <Grid item xs={5}>
            
              
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', marginLeft: -50, width: 570,border: '3px solid black', 
              height: 400, paddingLeft: 20, backgroundColor: '#E8E8E8' }}>
              <h3>Generated Java Code:</h3>
              <code>{generatedJavaCode}</code>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', marginLeft: -50, width: 570,border: '3px solid black', 
              height: 400, paddingLeft: 20, backgroundColor: '#E8E8E8' }}>
              <h3>Generated Python Code:</h3>
              <code>{generatedPythonCode}</code>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', marginLeft: -50, width: 570,border: '3px solid black', 
              height: 400, paddingLeft: 20, backgroundColor: '#E8E8E8' }}>
              <h3>Generated Php Code:</h3>
              <code>{generatedPhpCode}</code>
            </div>          
           
          </Grid>
        </Grid>
      </Box>

      <ClassDialog
        open={openClassDialog}
        onClose={() => setOpenClassDialog(false)}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        handleAddClass={handleAddClass}
      />

      <AssociationDialog
        open={openAssociationDialog}
        onClose={() => setOpenAssociationDialog(false)}
        associationDetails={associationDetails}
        setAssociationDetails={setAssociationDetails}
        handleAddAssociation={handleAddAssociation}
      />
    </div>
  );
};

export default DiagramMap;