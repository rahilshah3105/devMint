import { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import ResourceLinks from '../components/ResourceLinks';
import CustomSelect from '../components/CustomSelect';
import { LANGUAGES } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import './ToolPage.css';

export default function DiffChecker() {
  const { theme } = useTheme();
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [originalCode, setOriginalCode] = useState('// Original Text\nfunction greet() {\n  console.log("Hello, world!");\n}');
  const [modifiedCode, setModifiedCode] = useState('// Modified Text\nfunction greet(name) {\n  console.log(`Hello, ${name}!`);\n}');

  const resources = [
    { title: "Understanding Git Diff", url: "https://git-scm.com/docs/git-diff" },
    { title: "Monaco Diff Editor", url: "https://microsoft.github.io/monaco-editor/" }
  ];

  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header">
        <div>
          <h2>Code Diff Checker</h2>
          <p>Easily compare two code snippets side-by-side to find differences.</p>
        </div>
        <div className="flex gap-2 relative z-20">
          <CustomSelect 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={LANGUAGES.map(lang => ({ value: lang.id, label: lang.name }))}
          />
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden min-h-[400px]">
        <DiffEditor
          height="100%"
          language={language}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          original={originalCode}
          modified={modifiedCode}
          options={{
            renderSideBySide: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
          }}
        />
      </div>

      <ResourceLinks links={resources} />
    </div>
  );
}
