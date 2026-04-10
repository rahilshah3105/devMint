import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ResourceLinks from '../components/ResourceLinks';
import './ToolPage.css';

const AUTO_SEARCH_DELAY_MS = 140;

const escapeHtml = (text = '') => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getLineAndColumn = (text, index) => {
  if (index < 0) return { line: null, column: null };
  const textBeforeMatch = text.slice(0, index);
  const lines = textBeforeMatch.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
};

export default function JsonToolkit() {
  const [input, setInput] = useLocalStorage('json_toolkit_input', '');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMatches, setSearchMatches] = useState([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState(-1);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isWholeWord, setIsWholeWord] = useState(false);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const highlightLayerRef = useRef(null);

  const isWordChar = (char = '') => /[A-Za-z0-9_]/.test(char);

  const getMatchPositions = (text, query, caseSensitive = false, wholeWord = false) => {
    if (!query.trim()) return [];

    const sourceText = caseSensitive ? text : text.toLowerCase();
    const sourceQuery = caseSensitive ? query : query.toLowerCase();
    const matches = [];
    let cursor = 0;

    while (cursor < sourceText.length) {
      const foundIndex = sourceText.indexOf(sourceQuery, cursor);
      if (foundIndex === -1) break;

      if (!wholeWord) {
        matches.push(foundIndex);
      } else {
        const beforeChar = sourceText[foundIndex - 1] ?? '';
        const afterChar = sourceText[foundIndex + sourceQuery.length] ?? '';
        const hasWordBoundary = !isWordChar(beforeChar) && !isWordChar(afterChar);
        if (hasWordBoundary) {
          matches.push(foundIndex);
        }
      }

      cursor = foundIndex + sourceQuery.length;
    }

    return matches;
  };

  const updateSearchState = (
    text,
    query,
    caseSensitive = isCaseSensitive,
    wholeWord = isWholeWord,
    autoSelectFirst = false
  ) => {
    const matches = getMatchPositions(text, query, caseSensitive, wholeWord);
    setSearchMatches(matches);
    setActiveMatchIndex(matches.length && autoSelectFirst ? 0 : -1);
    return matches;
  };

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

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchMatches([]);
    setActiveMatchIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFindMatch = useCallback((direction = 1) => {
    if (!searchTerm.trim()) {
      setStatus({ type: 'error', message: 'Enter text to search in JSON input.' });
      return;
    }

    const matches = getMatchPositions(input, searchTerm, isCaseSensitive, isWholeWord);
    setSearchMatches(matches);

    if (!matches.length) {
      setActiveMatchIndex(-1);
      setStatus({ type: 'error', message: 'No matches found in JSON input.' });
      return;
    }

    const nextIndex =
      activeMatchIndex === -1
        ? direction > 0
          ? 0
          : matches.length - 1
        : (activeMatchIndex + direction + matches.length) % matches.length;

    setActiveMatchIndex(nextIndex);
    const start = matches[nextIndex];
    const end = start + searchTerm.length;

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(start, end);
    }

    setStatus({ type: 'success', message: `Match ${nextIndex + 1} of ${matches.length}.` });
  }, [activeMatchIndex, input, isCaseSensitive, isWholeWord, searchTerm]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const isMetaOrCtrl = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (isMetaOrCtrl && key === 'f') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
        return;
      }

      const isFindNext = (isMetaOrCtrl && key === 'g') || event.key === 'F3';
      if (isFindNext) {
        event.preventDefault();
        handleFindMatch(event.shiftKey ? -1 : 1);
        return;
      }

      const isSearchInputFocused = document.activeElement === searchInputRef.current;
      if (isSearchInputFocused && event.key === 'Enter') {
        event.preventDefault();
        handleFindMatch(event.shiftKey ? -1 : 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleFindMatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setSearchMatches([]);
        setActiveMatchIndex(-1);
        return;
      }

      const matches = getMatchPositions(input, searchTerm, isCaseSensitive, isWholeWord);
      setSearchMatches(matches);
      setActiveMatchIndex(matches.length ? 0 : -1);
    }, AUTO_SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [input, isCaseSensitive, isWholeWord, searchTerm]);

  const resources = [
    { title: 'RFC 8259 - JSON Standard', url: 'https://www.rfc-editor.org/rfc/rfc8259' },
    { title: 'MDN: JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' }
  ];

  const hasActiveMatch =
    activeMatchIndex >= 0 &&
    activeMatchIndex < searchMatches.length &&
    searchTerm.length > 0;

  const activeMatchStart = hasActiveMatch ? searchMatches[activeMatchIndex] : -1;
  const activeMatchEnd = hasActiveMatch ? activeMatchStart + searchTerm.length : -1;
  const { line: activeMatchLine, column: activeMatchColumn } = getLineAndColumn(input, activeMatchStart);
  const highlightedInputHtml = searchTerm.trim() && searchMatches.length
    ? (() => {
      let html = '';
      let cursor = 0;

      searchMatches.forEach((start, index) => {
        const end = start + searchTerm.length;
        const className =
            index === activeMatchIndex
              ? 'json-match-highlight json-match-highlight-active'
              : 'json-match-highlight';

        html += escapeHtml(input.slice(cursor, start));
        html += `<mark class="${className}">${escapeHtml(input.slice(start, end))}</mark>`;
        cursor = end;
      });

      html += escapeHtml(input.slice(cursor));
      return html;
    })()
    : escapeHtml(input);

  const syncHighlightScroll = useCallback(() => {
    if (!inputRef.current || !highlightLayerRef.current) return;
    highlightLayerRef.current.scrollTop = inputRef.current.scrollTop;
    highlightLayerRef.current.scrollLeft = inputRef.current.scrollLeft;
  }, []);

  useEffect(() => {
    if (!hasActiveMatch || !inputRef.current) return;
    inputRef.current.setSelectionRange(activeMatchStart, activeMatchEnd);
  }, [activeMatchEnd, activeMatchStart, hasActiveMatch]);

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

      <div
        className="glass-panel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
          padding: '12px'
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1 1 460px',
            minWidth: '280px',
            maxWidth: '620px'
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            className="tool-number-input"
            style={{ width: '100%', paddingRight: '36px' }}
            value={searchTerm}
            onChange={(e) => {
              const nextSearchTerm = e.target.value;
              setSearchTerm(nextSearchTerm);
              updateSearchState(input, nextSearchTerm, isCaseSensitive, isWholeWord, true);
            }}
            placeholder="Find text in JSON input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              title="Clear search"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                borderRadius: '999px',
                display: 'grid',
                placeItems: 'center',
                fontSize: '14px',
                lineHeight: 1,
                border: '1px solid rgba(148,163,184,0.35)',
                background: 'rgba(148,163,184,0.18)',
                color: 'var(--text-secondary)'
              }}
            >
              ×
            </button>
          )}
        </div>
        <button className="secondary-button" onClick={() => handleFindMatch(-1)}>
          Find Previous
        </button>
        <button className="secondary-button" onClick={() => handleFindMatch(1)}>
          Find Next
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            const nextCaseSensitive = !isCaseSensitive;
            setIsCaseSensitive(nextCaseSensitive);
            updateSearchState(input, searchTerm, nextCaseSensitive, isWholeWord, true);
          }}
        >
          {isCaseSensitive ? 'Case: Sensitive' : 'Case: Insensitive'}
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            const nextWholeWord = !isWholeWord;
            setIsWholeWord(nextWholeWord);
            updateSearchState(input, searchTerm, isCaseSensitive, nextWholeWord, true);
          }}
        >
          {isWholeWord ? 'Match: Whole Word' : 'Match: Partial'}
        </button>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {searchTerm.trim()
            ? `${searchMatches.length} match${searchMatches.length === 1 ? '' : 'es'}`
            : 'Type text to start searching'}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {hasActiveMatch
            ? `Line ${activeMatchLine}, Column ${activeMatchColumn}`
            : 'Line -, Column -'}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Shortcuts: Ctrl/Cmd+F focus, Enter or F3 next, Shift+Enter or Shift+F3 previous, Ctrl/Cmd+G next
        </span>
      </div>

      <div className="split-view flex-1">
        <div className="split-panel glass-panel">
          <div className="panel-header">JSON Input</div>
          <div className="json-editor-wrap">
            <pre
              ref={highlightLayerRef}
              aria-hidden="true"
              className="json-highlight-layer custom-scrollbar"
              dangerouslySetInnerHTML={{ __html: highlightedInputHtml || '&nbsp;' }}
            />
            <textarea
              ref={inputRef}
              className="code-textarea custom-scrollbar json-editor-textarea"
              value={input}
              onScroll={syncHighlightScroll}
              onChange={(e) => {
                const nextInput = e.target.value;
                setInput(nextInput);
                if (searchTerm.trim()) {
                  updateSearchState(nextInput, searchTerm, isCaseSensitive, isWholeWord, true);
                }
              }}
              placeholder="Paste JSON here..."
            />
          </div>
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
