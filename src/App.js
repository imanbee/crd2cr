import React, {useState} from 'react'
import logo from './logo.svg';
import './App.css';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/yaml/yaml';
import axios from 'axios';
import Spinner from "react-svg-spinner";

function App() {
  const [crd, setCRD] = useState("");
  const [cr, setCR] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCRDChange = async (editor, data, value) => {
    if (value !== '') {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.post('https://us-central1-crd2cr.cloudfunctions.net/crd2cr', value)
        if (response) {
          
          setCR(response.data);  
          setLoading(false);
        }
        
      } catch (error) {
        setLoading(false);
        setError(true);
      }
      
    }
  }

  const onCRChange = (editor, data, value) => {
    console.log(value)
  }
  return (
    <div className="App">
 
      <CodeMirror
        value={crd}
        options={{
          mode: 'yaml',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true
        }}
        onBeforeChange={(editor, data, value) => {
          setCRD(value)
        }}
        onChange={onCRDChange}
      />
      <CodeMirror
        value={cr}
        options={{
          mode: 'yaml',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true
        }}
        onBeforeChange={(editor, data, value) => {
          setCR(value)
        }}
        onChange={onCRChange}
      />
      {error && <div class="error">Can't convert this value</div>}
      {loading && <div class="loading"><Spinner size={90} /></div>}
    </div>
  );
}

export default App;
