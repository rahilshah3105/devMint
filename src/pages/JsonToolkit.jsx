import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ResourceLinks from '../components/ResourceLinks';
import './ToolPage.css';

export default function JsonToolkit() {
  const [input, setInput] = useLocalStorage('json_toolkit_input', '');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const parseJson = () => {
    if (!input.trim()) {
      setStatus({ type: 'error', message: 'Input is empty. Paste JSON first.' });
      return null;
    }

    try {
      return JSON.parse(input);
    } catch (error) {
      setStatus({ type: 'error', message: `Invalid JSON: ${error.message}` });
      return null;
    }
  };

  const handleFormat = () => {
    const parsed = parseJson();
    if (!parsed) return;

    const formatted = JSON.stringify(parsed, null, 2);
    setOutput(formatted);
    setStatus({ type: 'success', message: 'JSON is valid and formatted.' });
  };

  const handleMinify = () => {
    const parsed = parseJson();
    if (!parsed) return;

    const minified = JSON.stringify(parsed);
    setOutput(minified);
    setStatus({ type: 'success', message: 'JSON minified successfully.' });
  };

  const handleValidate = () => {
    const parsed = parseJson();
    if (!parsed) return;

    setStatus({ type: 'success', message: 'JSON is valid.' });
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setStatus({ type: 'success', message: 'Output copied to clipboard.' });
    }
  };

  const resources = [
    { title: 'RFC 8259 - JSON Standard', url: 'https://www.rfc-editor.org/rfc/rfc8259' },
    { title: 'MDN: JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' }
  ];

  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header">
        <div>
          <h2>JSON Toolkit</h2>
          <p>Validate, beautify, and minify JSON safely in your browser.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="secondary-button" onClick={handleValidate}>Validate</button>
          <button className="secondary-button" onClick={handleFormat}>Beautify</button>
          <button className="secondary-button" onClick={handleMinify}>Minify</button>
          <button className="primary-button" onClick={handleCopy}>Copy Output</button>
        </div>
      </header>

      <div className="split-view flex-1">
        <div className="split-panel glass-panel">
          <div className="panel-header">JSON Input</div>
          <textarea
            className="code-textarea custom-scrollbar"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
          />
        </div>

        <div className="split-panel glass-panel">
          <div className="panel-header">Output</div>
          <textarea
            className="code-textarea custom-scrollbar"
            value={output}
            readOnly
            placeholder="Validation results or transformed JSON will appear here..."
          />
        </div>
      </div>

      {status.message && (
        <div
          className="rounded-md px-4 py-2 text-sm"
          style={{
            background: status.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: status.type === 'success' ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(239,68,68,0.35)',
            color: status.type === 'success' ? 'var(--accent-success)' : 'var(--accent-error)'
          }}
        >
          {status.message}
        </div>
      )}

      <ResourceLinks links={resources} />
    </div>
  );
}
