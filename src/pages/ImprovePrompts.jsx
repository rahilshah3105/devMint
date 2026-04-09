import { useMemo, useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ResourceLinks from '../components/ResourceLinks';
import CustomSelect from '../components/CustomSelect';
import './ToolPage.css';

const TONE_OPTIONS = ['Professional', 'Friendly', 'Concise', 'Detailed', 'Analytical'];
const FORMAT_OPTIONS = ['Bullets', 'Step-by-step', 'JSON', 'Markdown', 'Plain text'];

const fieldStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--border-light)',
  backgroundColor: 'rgba(128, 128, 128, 0.08)',
  color: 'var(--text-primary)',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  marginBottom: 8,
  color: 'var(--text-secondary)',
};

function normalizeList(value) {
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^[-*\d.)\s]+/, '').trim());
}

function buildImprovedPrompt({
  userPrompt,
  goal,
  audience,
  tone,
  format,
  constraints,
  context,
  includeExamples,
  askClarifyingQuestions,
}) {
  const parsedConstraints = normalizeList(constraints);
  const parsedContext = normalizeList(context);

  // Synthesize a clear, actionable prompt
  let improved = '';
  improved += `You are an expert assistant writing for ${audience || 'a general audience'}.\n`;
  if (goal) {
    improved += `Your main goal: ${goal}\n`;
  }
  if (parsedContext.length) {
    improved += `Context: ${parsedContext.join('; ')}\n`;
  }
  if (parsedConstraints.length) {
    improved += `Please follow these constraints: ${parsedConstraints.join('; ')}\n`;
  }
  improved += `Use a ${tone.toLowerCase()} tone and present the output in ${format} format.\n`;
  if (askClarifyingQuestions) {
    improved += `If anything is unclear, ask up to 3 clarifying questions before answering.\n`;
  } else {
    improved += `If you need to make assumptions, state them briefly and proceed.\n`;
  }
  if (includeExamples) {
    improved += `Include a short, concrete example if it helps illustrate the answer.\n`;
  }
  improved += '\nRewrite and improve the following user request for clarity and completeness:';
  improved += `\n---\n${userPrompt || '[Add your raw prompt here]'}\n---`;
  improved += '\n\nReturn a single, well-structured prompt that incorporates all the above.';
  return improved;
}

export default function ImprovePrompts() {
  const [userPrompt, setUserPrompt] = useLocalStorage('prompt_improver_input', 'Write a better API documentation for my endpoint.');
  const [goal, setGoal] = useLocalStorage('prompt_improver_goal', 'Generate a clear, production-ready output.');
  const [audience, setAudience] = useLocalStorage('prompt_improver_audience', 'Developers');
  const [tone, setTone] = useLocalStorage('prompt_improver_tone', 'Professional');
  const [format, setFormat] = useLocalStorage('prompt_improver_format', 'Markdown');
  const [constraints, setConstraints] = useLocalStorage(
    'prompt_improver_constraints',
    'Keep it concise\nUse actionable language\nAvoid unnecessary filler'
  );
  const [context, setContext] = useLocalStorage(
    'prompt_improver_context',
    'API is REST-based\nAudience is junior to mid-level developers'
  );
  const [includeExamples, setIncludeExamples] = useLocalStorage('prompt_improver_examples', true);
  const [askClarifyingQuestions, setAskClarifyingQuestions] = useLocalStorage('prompt_improver_clarify', false);
  const [copied, setCopied] = useState(false);

  const improvedPrompt = useMemo(() => buildImprovedPrompt({
    userPrompt,
    goal,
    audience,
    tone,
    format,
    constraints,
    context,
    includeExamples,
    askClarifyingQuestions,
  }), [
    userPrompt,
    goal,
    audience,
    tone,
    format,
    constraints,
    context,
    includeExamples,
    askClarifyingQuestions,
  ]);

  const resetDefaults = () => {
    setUserPrompt('Write a better API documentation for my endpoint.');
    setGoal('Generate a clear, production-ready output.');
    setAudience('Developers');
    setTone('Professional');
    setFormat('Markdown');
    setConstraints('Keep it concise\nUse actionable language\nAvoid unnecessary filler');
    setContext('API is REST-based\nAudience is junior to mid-level developers');
    setIncludeExamples(true);
    setAskClarifyingQuestions(false);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!improvedPrompt.trim()) return;
    await navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const resources = [
    { title: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    { title: 'Anthropic Prompt Library', url: 'https://docs.anthropic.com/en/prompt-library/library' },
    { title: 'Google Prompt Design', url: 'https://ai.google.dev/gemini-api/docs/prompting-intro' },
  ];

  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header">
        <div>
          <h2>Improve Prompts</h2>
          <p>Turn rough prompts into clear, structured, and high-quality prompts for better AI responses.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary-button" onClick={resetDefaults}>
            <RefreshCw size={14} style={{ marginRight: 6 }} />
            Reset
          </button>
          <button className="primary-button" onClick={copyOutput}>
            <Copy size={14} style={{ marginRight: 6 }} />
            {copied ? 'Copied' : 'Copy Improved Prompt'}
          </button>
        </div>
      </header>

      <div className="split-view flex-1">
        <div className="split-panel glass-panel">
          <div className="panel-header">Prompt Builder</div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-sm mb-2 text-[var(--text-secondary)]">Original Prompt</label>
              <textarea
                className="code-textarea"
                style={{ minHeight: 130, border: '1px solid var(--border-light)', borderRadius: 8 }}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Paste your raw prompt here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div style={{marginRight: '10px'}}>
                <label style={labelStyle}>Goal</label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={fieldStyle}
                  placeholder="What should the model achieve?"
                />
              </div>
              <div>
                <label style={labelStyle}>Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  style={fieldStyle}
                  placeholder="Who is this for?"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div style={{marginRight: '10px'}}>
                <label style={labelStyle}>Tone</label>
                <CustomSelect
                  className="full-width"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  options={TONE_OPTIONS.map(opt => ({ value: opt, label: opt }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Output Format</label>
                <CustomSelect
                  className="full-width"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  options={FORMAT_OPTIONS.map(opt => ({ value: opt, label: opt }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-[var(--text-secondary)]">Context (one per line)</label>
              <textarea
                className="code-textarea"
                style={{ minHeight: 100, border: '1px solid var(--border-light)', borderRadius: 8 }}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Project context, tech stack, constraints..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[var(--text-secondary)]">Constraints (one per line)</label>
              <textarea
                className="code-textarea"
                style={{ minHeight: 100, border: '1px solid var(--border-light)', borderRadius: 8 }}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Length limits, style rules, forbidden items..."
              />
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExamples}
                  onChange={(e) => setIncludeExamples(e.target.checked)}
                />
                Include examples
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={askClarifyingQuestions}
                  onChange={(e) => setAskClarifyingQuestions(e.target.checked)}
                />
                Ask clarifying questions when ambiguous
              </label>
            </div>
          </div>
        </div>

        <div className="split-panel glass-panel">
          <div className="panel-header">Improved Prompt</div>
          <textarea
            className="code-textarea custom-scrollbar"
            value={improvedPrompt}
            readOnly
            placeholder="Improved prompt appears here..."
          />
        </div>
      </div>

      <ResourceLinks links={resources} />
    </div>
  );
}