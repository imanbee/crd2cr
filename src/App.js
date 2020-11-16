import React, {useEffect, useState, useCallback} from 'react'
import './App.css';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/yaml/yaml';
import axios from 'axios';
import Spinner from "react-svg-spinner";
import initialValue from './initialValue';

function App() {
  const [crd, setCRD] = useState(initialValue);
  const [cr, setCR] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const convert = useCallback(async (value) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.post('https://us-central1-crd2cr.cloudfunctions.net/crd2cr', value)
      if (response) {
        setCR(response.data);  
        setLoading(false);
      }
      
    } catch (error) {
      setCR("")
      setLoading(false);
      setError(true);
    }
  }, [setCR, setLoading, setError])

  useEffect(() => {
    convert(crd);
  }, [convert, crd])

  const onCRDChange = (editor, data, value) => {
    if (value !== '') {
      convert(value);
    }
  }

  const onCRChange = (editor, data, value) => {
    console.log(value)
  }
  return (
    <div className="App">
      <div className="disclaimer">
        <h1>CRD to CR</h1>

        <h2>Generate simple Custom Resource based on <br/> Custom Resource Definition</h2>
        <p>It's very hard to write your own first CR based on a CRD openAPIV3Schema, that's why I built this simple service that helps to do that by generating simple CR where you can put needed values. Supported types array, string, integer, boolean and object, enum also supported.</p>
        <hr/>
        <p>only <code>apiextensions.k8s.io/v1</code> version supported</p>
        <a className="github" href="https://github.com/aborilov/crd2cr" target="_blank">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="/>
        </a>
      </div>
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
