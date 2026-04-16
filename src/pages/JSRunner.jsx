import { useState } from 'react';
import ResourceLinks from '../components/ResourceLinks';
import { Play, Trash2 } from 'lucide-react';
import './ToolPage.css';

export default function JSRunner() {
  const [inputCode, setInputCode] = useState('// Write your JS code here\nconsole.log("Hello, DevToolkit!");\n');
  const [logs, setLogs] = useState([]);

  const handleEditorShortcut = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
  };

  const runCode = () => {
    const logOutput = [];
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    const lines = inputCode.split('\n');
    const totalLines = lines.length;

    console.log = (...args) => {
      logOutput.push({ type: 'log', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') });
      originalConsole.log(...args);
    };
    console.error = (...args) => {
      logOutput.push({ type: 'error', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') });
      originalConsole.error(...args);
    };
    console.warn = (...args) => {
      logOutput.push({ type: 'warn', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') });
      originalConsole.warn(...args);
    };
    console.info = (...args) => {
      logOutput.push({ type: 'info', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') });
      originalConsole.info(...args);
    };

    try {
      logOutput.push({ type: 'info', message: '=== Code Execution Started ===' });
      
      let result;
      try {
        const wrappedCode = `(function(){\n${inputCode}\n})();\n//# sourceURL=user-code.js`;
        result = eval(wrappedCode);
      } catch (evalError) {
        if (evalError instanceof SyntaxError) {
          throw evalError;
        }
        const func = new Function(inputCode);
        result = func();
      }

      if (result !== undefined) {
        logOutput.push({ type: 'log', message: `Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}` });
      }

      logOutput.push({ type: 'success', message: '✓ Execution completed!' });
    } catch (error) {
      logOutput.push({ type: 'error', message: `[${error.name}] ${error.message}` });
    } finally {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    }

    setLogs(logOutput);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resources = [
    { title: "MDN: JavaScript Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics" },
    { title: "JS Try/Catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch" }
  ];

  return (
    <div className="tool-page">
      <header className="tool-header">
        <div>
          <h2>JavaScript Runner (Browser)</h2>
          <p>Runs JavaScript directly in your browser context. Use Remote Runner for JavaScript (Node.js) execution.</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Shortcut: Ctrl/Cmd + Enter to run code</p>
        </div>
        <div className="flex gap-2">
          <button className="secondary-button flex items-center gap-2" onClick={clearLogs}>
            <Trash2 size={16} /> Clear Output
          </button>
          <button className="primary-button !flex !items-center gap-2" onClick={runCode}>
            <Play size={16} fill="currentColor" /> Run Code
          </button>
        </div>
      </header>

      <div className="split-view">
        <div className="split-panel glass-panel">
          <div className="panel-header">JS Code</div>
          <textarea
            className="code-textarea custom-scrollbar"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleEditorShortcut}
            spellCheck="false"
          />
        </div>
        <div className="split-panel glass-panel bg-[#0a0a0b]">
          <div className="panel-header text-[var(--accent-primary)] border-b border-[rgba(59,130,246,0.2)]">Console Output</div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-[var(--text-muted)] italic">Output will appear here...</div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-1 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'warn' ? 'text-yellow-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'info' ? 'text-blue-400' : 
                    'text-gray-300'
                  }`}
                >
                  <span className="opacity-50 mr-2">[{log.type}]</span>
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ResourceLinks links={resources} />
    </div>
  );
}
