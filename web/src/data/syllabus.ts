// Certification syllabus. To CLONE the app for another certification, rewrite this
// `SYLLABUS` array and edit the identity/threshold in `src/config.ts`. There is no
// hardcoded branding text in the components.
//
// Current certification: Claude Certified Architect – Foundations (CCA-F).
// OFFICIAL exam domains and weights:
//   1. Agent Architecture & Orchestration ............. 27%
//   2. Claude Code Configuration & Workflows .......... 20%
//   3. Prompt Engineering & Structured Outputs ........ 20%
//   4. Tool Design & MCP Integration .................. 18%
//   5. Context Management & Reliability ............... 15%
//
// Content lives here (versioned in git); Firestore only stores the user's PROGRESS
// (checkboxes, deadlines, quiz scores, study log, podcast links).

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  /** 0-based index of the correct option within `options`. */
  answer: number
  explanation?: string
}

/** Curated recommended resource (shipped with the syllabus). */
export interface Resource {
  title: string
  url: string
  /** Short source label, e.g. "LinkedIn Learning". */
  source?: string
}

export interface Topic {
  id: string
  title: string
  blurb: string
  /** Recommended resources specific to this topic. */
  resources?: Resource[]
}

export interface Domain {
  id: string
  title: string
  description: string
  /** Emoji or short glyph used as a visual accent on the card. */
  icon: string
  /** Domain weight in the exam, as a percentage. All weights sum to 100. */
  weight: number
  /** Suggested deadline (ISO yyyy-mm-dd) per the study plan. */
  suggestedDeadline?: string
  topics: Topic[]
  quiz: QuizQuestion[]
}

// Anthropic courses on LinkedIn Learning, reused as resources.
const COURSE_CLAUDE_API: Resource = {
  title: 'Building with the Claude API by Anthropic',
  url: 'https://www.linkedin.com/learning/building-with-the-claude-api-by-anthropic',
  source: 'LinkedIn Learning',
}
const COURSE_CLAUDE_CODE: Resource = {
  title: 'Claude Code in Action by Anthropic',
  url: 'https://www.linkedin.com/learning/claude-code-in-action-by-anthropic',
  source: 'LinkedIn Learning',
}
const COURSE_MCP_INTRO: Resource = {
  title: 'Introduction to Model Context Protocol by Anthropic',
  url: 'https://www.linkedin.com/learning/introduction-to-model-context-protocol-by-anthropic',
  source: 'LinkedIn Learning',
}
const COURSE_MCP_ADVANCED: Resource = {
  title: 'Model Context Protocol: Advanced Topics by Anthropic',
  url: 'https://www.linkedin.com/learning/model-context-protocol-advanced-topics-by-anthropic',
  source: 'LinkedIn Learning',
}

export const SYLLABUS: Domain[] = [
  {
    id: 'agents',
    title: 'Agent Architecture & Orchestration',
    description:
      'Designing autonomous agents: loop patterns, subagent orchestration, memory, and choosing between workflows and agents.',
    icon: '◈',
    weight: 27,
    suggestedDeadline: '2026-07-26',
    topics: [
      {
        id: 'agent-patterns',
        title: 'Agent patterns',
        blurb: 'Plan–act-with-tools–observe loop; reflection.',
        resources: [
          { title: 'Building effective AI agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', source: 'Anthropic' },
          { title: 'How We Build Effective Agents — Barry Zhang', url: 'https://www.youtube.com/watch?v=D7_ipDqhtwk', source: 'YouTube' },
        ],
      },
      {
        id: 'workflows-vs-agents',
        title: 'Workflows vs. agents',
        blurb: 'Chaining, routing, parallelization, and orchestrator-workers.',
        resources: [
          { title: 'Building effective AI agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', source: 'Anthropic' },
        ],
      },
      {
        id: 'subagents',
        title: 'Subagents & orchestration',
        blurb: 'Delegating to specialized agents while isolating context.',
      },
      {
        id: 'memory',
        title: 'State & memory',
        blurb: 'Managing memory and state across agent steps.',
      },
      {
        id: 'models',
        title: 'Model selection for agents',
        blurb: 'Opus/Sonnet/Haiku: capability vs. cost vs. latency.',
        resources: [
          { title: 'Models overview (docs)', url: 'https://platform.claude.com/docs/en/about-claude/models/overview', source: 'Docs' },
        ],
      },
      {
        id: 'eval-agents',
        title: 'Agent evaluation & reliability',
        blurb: 'Measuring behavior, evals, and guardrails.',
        resources: [COURSE_CLAUDE_API],
      },
    ],
    quiz: [
      {
        id: 'ag-q1',
        question: 'What is a key advantage of using subagents?',
        options: ['They eliminate token cost', 'They isolate context and specialize tasks', 'They avoid using tools', 'They guarantee zero hallucinations'],
        answer: 1,
        explanation: 'Subagents let you split the work and keep each context focused.',
      },
      {
        id: 'ag-q2',
        question: 'According to Anthropic, when is a "workflow" preferable to an "agent"?',
        options: ['Whenever there are tools', 'When the steps are predictable and fixed', 'Only with RAG', 'Never, agents are always better'],
        answer: 1,
        explanation: 'Workflows = predictable orchestrated paths; agents = the model drives dynamically. Start simple.',
      },
      {
        id: 'ag-q3',
        question: 'A typical agent pattern combines…',
        options: ['A single fixed prompt', 'Planning loop + tool use + observation', 'Only embeddings', 'Only prefilling'],
        answer: 1,
        explanation: 'Agents iterate: they plan, act with tools, and observe the results.',
      },
      {
        id: 'ag-q4',
        question: 'In the orchestrator-workers pattern, what does the orchestrator do?',
        options: ['Runs every task itself', 'Decomposes the task and delegates subtasks to workers', 'Only caches responses', 'Replaces the model'],
        answer: 1,
        explanation: 'The orchestrator breaks down the problem and coordinates worker agents that solve each part.',
      },
      {
        id: 'ag-q5',
        question: 'The evaluator-optimizer pattern consists of…',
        options: ['One agent that generates and another that critiques/improves iteratively', 'Two identical models in parallel', 'Caching the system prompt', 'Always forcing a tool'],
        answer: 0,
        explanation: 'One agent produces a response and another evaluates it and suggests improvements in a loop.',
      },
      {
        id: 'ag-q6',
        question: 'When is Claude Haiku a good choice for an agent?',
        options: ['When latency and cost matter more than deep reasoning', 'Always, it is the best', 'Only for vision', 'Never in agents'],
        answer: 0,
        explanation: 'Haiku is the fastest and cheapest; ideal for simple, high-volume steps.',
      },
      {
        id: 'ag-q7',
        question: 'According to Anthropic, when building agents you should…',
        options: ['Start with the most complex framework', 'Start simple and add complexity only if it improves results', 'Avoid tools', 'Always use multi-agent'],
        answer: 1,
        explanation: 'The guidance is to start with the simplest thing that works and add complexity only when it pays off.',
      },
      {
        id: 'ag-q8',
        question: 'The "routing" pattern in workflows is used to…',
        options: ['Classify the input and send it to the specialized flow/prompt', 'Encrypt messages', 'Reduce output tokens', 'Generate embeddings'],
        answer: 0,
        explanation: 'Routing classifies the input and directs it to the appropriate specialized handler.',
      },
      {
        id: 'ag-q9',
        question: 'Why give an agent memory/state across steps?',
        options: ['To avoid losing context and prior decisions during the task', 'To increase temperature', 'To avoid using tools', 'To encrypt the session'],
        answer: 0,
        explanation: 'Memory lets the agent keep context and coherence across multiple steps.',
      },
      {
        id: 'ag-q10',
        question: 'A good practice for agent reliability is…',
        options: ['Measure nothing', 'Define evals and guardrails that detect undesired behavior', 'Always move to the biggest model', 'Disable logs'],
        answer: 1,
        explanation: 'Evals and guardrails let you measure and bound the agent’s behavior in production.',
      },
    ],
  },
  {
    id: 'claude-code',
    title: 'Claude Code Configuration & Workflows',
    description:
      'Using Claude Code in development: context management, custom commands, hooks, the SDK, and integrations (MCP, GitHub).',
    icon: '⌘',
    weight: 20,
    suggestedDeadline: '2026-08-02',
    topics: [
      {
        id: 'cc-basics',
        title: 'What Claude Code is & setup',
        blurb: 'Installation, mental model, and first steps.',
        resources: [
          { title: 'Introducing Claude Code', url: 'https://www.youtube.com/watch?v=AJpK3YTTKZ4', source: 'YouTube' },
          { title: 'Mastering Claude Code in 30 minutes', url: 'https://www.youtube.com/watch?v=6eBSHbLKuN0', source: 'YouTube' },
        ],
      },
      {
        id: 'cc-context',
        title: 'Adding & controlling context',
        blurb: 'How to provide and limit the context Claude Code sees.',
        resources: [COURSE_CLAUDE_CODE],
      },
      {
        id: 'cc-commands',
        title: 'Custom commands',
        blurb: 'Your own automations and slash commands.',
        resources: [COURSE_CLAUDE_CODE],
      },
      {
        id: 'cc-mcp-github',
        title: 'MCP & GitHub in Claude Code',
        blurb: 'Connecting MCP servers and GitHub integration.',
        resources: [COURSE_CLAUDE_CODE],
      },
      {
        id: 'cc-hooks',
        title: 'Hooks',
        blurb: 'Defining and implementing useful lifecycle hooks.',
        resources: [COURSE_CLAUDE_CODE],
      },
      {
        id: 'cc-sdk',
        title: 'Claude Code SDK',
        blurb: 'Building on the SDK for custom workflows.',
        resources: [COURSE_CLAUDE_CODE],
      },
    ],
    quiz: [
      {
        id: 'cc-q1',
        question: 'What are hooks in Claude Code for?',
        options: ['Changing the model', 'Running automatic actions at lifecycle points', 'Encrypting the repository', 'Reducing tokens'],
        answer: 1,
        explanation: 'Hooks trigger commands on events (e.g. before/after a tool or when finishing).',
      },
      {
        id: 'cc-q2',
        question: 'How does Claude Code extend its access to external tools?',
        options: ['Only with environment variables', 'By connecting MCP servers', 'By editing the kernel', 'It cannot'],
        answer: 1,
        explanation: 'Claude Code can connect to MCP servers to add tools and data.',
      },
      {
        id: 'cc-q3',
        question: 'What are custom slash commands in Claude Code for?',
        options: ['Encapsulating reusable instructions/flows', 'Changing the OS language', 'Deleting git history', 'Reducing the context window'],
        answer: 0,
        explanation: 'Custom slash commands store repeatable prompts/flows for reuse.',
      },
      {
        id: 'cc-q4',
        question: 'Managing context well in Claude Code means…',
        options: ['Always giving it the whole repository', 'Providing only the relevant context and limiting noise', 'Disabling tools', 'Using only Haiku'],
        answer: 1,
        explanation: 'Controlling which files/context Claude sees improves accuracy and reduces cost.',
      },
      {
        id: 'cc-q5',
        question: 'A "PreToolUse" hook runs…',
        options: ['Before a tool is used', 'Only when closing the app', 'After the session ends', 'Never'],
        answer: 0,
        explanation: 'Hooks fire on lifecycle events; PreToolUse runs before a tool executes.',
      },
      {
        id: 'cc-q6',
        question: 'What does the Claude Code SDK enable?',
        options: ['Building custom integrations and flows on top of Claude Code', 'Training new models', 'Editing firmware', 'Replacing git'],
        answer: 0,
        explanation: 'The SDK lets you program and automate Claude Code in your own workflows.',
      },
      {
        id: 'cc-q7',
        question: 'The GitHub integration in Claude Code is mainly for…',
        options: ['Operating repos: PRs, issues, and code changes', 'Mining cryptocurrency', 'Rendering video', 'Sending emails'],
        answer: 0,
        explanation: 'It lets Claude Code work with GitHub repositories (PRs, issues, code).',
      },
      {
        id: 'cc-q8',
        question: 'What is an advantage of defining hooks in a project?',
        options: ['Automating repeatable team behaviors', 'Increasing the cost per token', 'Removing version control', 'Forcing the most expensive model'],
        answer: 0,
        explanation: 'Hooks encode automations (lint, validations, etc.) that run consistently.',
      },
      {
        id: 'cc-q9',
        question: 'To connect your own data source to Claude Code, the idiomatic way is…',
        options: ['Expose it through an MCP server', 'Paste everything into the prompt', 'Switch IDEs', 'It is not possible'],
        answer: 0,
        explanation: 'An MCP server exposes data/tools that Claude Code can consume in a standard way.',
      },
      {
        id: 'cc-q10',
        question: 'A good first step when adopting Claude Code in a repo is…',
        options: ['Document project context (e.g. in CLAUDE.md)', 'Delete the README', 'Commit secrets to the repo', 'Disable permissions'],
        answer: 0,
        explanation: 'Giving persistent project context helps Claude Code work better from the start.',
      },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering & Structured Outputs',
    description:
      'Techniques for effective, controllable prompts, and for getting reliable structured outputs (XML, JSON, prefilling).',
    icon: '✎',
    weight: 20,
    suggestedDeadline: '2026-06-28',
    topics: [
      {
        id: 'clarity-examples',
        title: 'Clarity & few-shot',
        blurb: 'Being specific and guiding with representative examples.',
        resources: [
          { title: 'Prompt engineering overview (docs)', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', source: 'Docs' },
          { title: 'AI prompt engineering: A deep dive', url: 'https://www.youtube.com/watch?v=T9aRN5JkmL8', source: 'YouTube' },
        ],
      },
      {
        id: 'cot',
        title: 'Chain-of-thought',
        blurb: 'Step-by-step reasoning for complex tasks.',
        resources: [
          { title: 'Prompt eng. interactive tutorial', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial', source: 'GitHub' },
        ],
      },
      {
        id: 'xml-structure',
        title: 'XML & structured outputs',
        blurb: 'XML/JSON tags to delimit and enforce output format.',
        resources: [
          { title: 'Prompt engineering overview (docs)', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', source: 'Docs' },
        ],
      },
      {
        id: 'extended-thinking',
        title: 'Extended thinking',
        blurb: 'When and how to enable extended thinking.',
      },
      {
        id: 'templates-prefill',
        title: 'Templates & prefilling',
        blurb: 'Assistant prefilling and reusable templates.',
      },
      {
        id: 'evals',
        title: 'Prompt evaluation',
        blurb: 'Test datasets and model-based/code-based grading.',
        resources: [COURSE_CLAUDE_API],
      },
    ],
    quiz: [
      {
        id: 'pe-q1',
        question: 'What are XML tags used for in a Claude prompt?',
        options: ['Reducing token cost', 'Delimiting and structuring input/output sections', 'Enabling vision mode', 'Encrypting the prompt'],
        answer: 1,
        explanation: 'Claude responds very well to XML for separating context, instructions, and output format.',
      },
      {
        id: 'pe-q2',
        question: '"Prefilling" consists of…',
        options: ['Filling in the system prompt', 'Starting the assistant’s response to guide the format', 'Preloading images', 'Caching the prompt'],
        answer: 1,
        explanation: 'Prefilling means starting the assistant turn with text that conditions the continuation.',
      },
      {
        id: 'pe-q3',
        question: 'What guarantees a tool’s output matches your schema exactly?',
        options: ['temperature: 0', 'strict: true in the tool definition', 'A long system prompt', 'stop_sequences'],
        answer: 1,
        explanation: 'Strict tool use (strict: true) forces the tool call to match the JSON Schema.',
      },
      {
        id: 'pe-q4',
        question: 'Few-shot prompting consists of…',
        options: ['Giving representative input/output examples in the prompt', 'Giving no instructions', 'Raising the temperature', 'Using only the system prompt'],
        answer: 0,
        explanation: 'Few-shot guides the model by showing examples of the desired behavior.',
      },
      {
        id: 'pe-q5',
        question: 'Where do you put global instructions for the assistant’s behavior?',
        options: ['In a role "user" message', 'In the top-level "system" parameter', 'In "metadata"', 'In a tool_result block'],
        answer: 1,
        explanation: 'The system prompt goes in the `system` parameter, not as just another message.',
      },
      {
        id: 'pe-q6',
        question: 'Claude’s extended thinking is most useful when…',
        options: ['The task requires complex multi-step reasoning', 'A short greeting is requested', 'Only a trivial yes/no classification', 'Echoing the input'],
        answer: 0,
        explanation: 'Extended thinking helps on problems that require deep, multi-step reasoning.',
      },
      {
        id: 'pe-q7',
        question: 'To get reliable JSON from Claude, a good technique is…',
        options: ['Ask for it in vague language', 'Define the schema and/or use prefilling and strict tool use', 'Raise temperature to 1', 'Remove the system prompt'],
        answer: 1,
        explanation: 'Specifying the format (schema, prefilling, or strict tool use) makes structured output more reliable.',
      },
      {
        id: 'pe-q8',
        question: 'Why use XML tags like <document> in the prompt?',
        options: ['To clearly delimit sections and reduce ambiguity', 'To encrypt the content', 'To speed up the model', 'They have no effect'],
        answer: 0,
        explanation: 'Claude makes good use of XML tags to separate context, instructions, and output.',
      },
      {
        id: 'pe-q9',
        question: 'In prompt evaluation, "model-based grading" means…',
        options: ['Using a model to score outputs against criteria', 'Always grading by hand', 'Not evaluating', 'Measuring only latency'],
        answer: 0,
        explanation: 'A model (LLM-as-judge) is used to evaluate responses against defined criteria.',
      },
      {
        id: 'pe-q10',
        question: 'A key prompting recommendation is…',
        options: ['Be clear and specific about what you want', 'Leave everything implicit', 'Avoid examples', 'Always use the shortest possible prompt'],
        answer: 0,
        explanation: 'Clarity and specificity is the foundation of a good prompt.',
      },
    ],
  },
  {
    id: 'tools-mcp',
    title: 'Tool Design & MCP Integration',
    description:
      'Defining tools (function calling) and connecting models to data and systems via the Model Context Protocol.',
    icon: '⟐',
    weight: 18,
    suggestedDeadline: '2026-07-12',
    topics: [
      {
        id: 'tool-schemas',
        title: 'Schemas & tool loop',
        blurb: 'Definition with JSON Schema and the tool_use/tool_result cycle.',
        resources: [
          { title: 'Tool use with Claude (docs)', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview', source: 'Docs' },
        ],
      },
      {
        id: 'tool-choice',
        title: 'Tool choice & parallel tools',
        blurb: 'auto/any/none, forcing tools, and multiple calls.',
        resources: [
          { title: 'Tool use with Claude (docs)', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview', source: 'Docs' },
        ],
      },
      {
        id: 'mcp-primitives',
        title: 'MCP: tools, resources & prompts',
        blurb: 'The primitives an MCP server exposes.',
        resources: [
          { title: 'What is MCP? (introduction)', url: 'https://modelcontextprotocol.io/introduction', source: 'modelcontextprotocol.io' },
          COURSE_MCP_INTRO,
        ],
      },
      {
        id: 'mcp-servers',
        title: 'MCP servers & clients',
        blurb: 'Building and integrating servers/clients (Python SDK).',
        resources: [
          { title: 'Build an MCP server', url: 'https://modelcontextprotocol.io/docs/develop/build-server', source: 'modelcontextprotocol.io' },
          { title: 'Building Agents with MCP — Full Workshop', url: 'https://www.youtube.com/watch?v=kQmXtrmQ5Zg', source: 'YouTube' },
        ],
      },
      {
        id: 'mcp-transports',
        title: 'Transports & communication',
        blurb: 'stdio and StreamableHTTP; state and JSON messages.',
        resources: [COURSE_MCP_ADVANCED],
      },
      {
        id: 'mcp-security',
        title: 'Security & advanced capabilities',
        blurb: 'Sampling, notifications, roots (FS), and attack surface.',
        resources: [COURSE_MCP_ADVANCED],
      },
    ],
    quiz: [
      {
        id: 'tu-q1',
        question: 'After a `tool_use` block, what must your application send back to Claude?',
        options: ['A new system prompt', 'A message with a `tool_result` block', 'Nothing, Claude resolves it itself', 'An image'],
        answer: 1,
        explanation: 'The client executes the tool (client tool) and returns the result in a `tool_result` block.',
      },
      {
        id: 'mcp-q1',
        question: 'Which is NOT a standard primitive of an MCP server?',
        options: ['Tools', 'Resources', 'Prompts', 'Webhooks'],
        answer: 3,
        explanation: 'MCP defines tools, resources, and prompts (among others); "webhooks" is not a protocol primitive.',
      },
      {
        id: 'mcp-q2',
        question: 'Which transport is typical for a local MCP server?',
        options: ['stdio', 'FTP', 'SMTP', 'WebRTC'],
        answer: 0,
        explanation: 'stdio is common for local servers; StreamableHTTP for remote ones.',
      },
      {
        id: 'tu-q2',
        question: 'With tool_choice = {"type": "auto"}, Claude…',
        options: ['Always calls a tool', 'Decides each turn whether to call a tool or respond directly', 'Never uses tools', 'Calls all of them at once'],
        answer: 1,
        explanation: 'With "auto", the model decides turn by turn whether to use a tool or respond directly.',
      },
      {
        id: 'tu-q3',
        question: 'A "client tool" differs from a "server tool" in that…',
        options: ['Your application runs it, not Anthropic’s infrastructure', 'It is always slower', 'It needs no schema', 'It only works on Haiku'],
        answer: 0,
        explanation: 'Client tools are run by your code; server tools (e.g. web_search) run on Anthropic.',
      },
      {
        id: 'tu-q4',
        question: 'A tool’s input is defined with…',
        options: ['A JSON Schema', 'A .env file', 'Unstructured free text', 'An image'],
        answer: 0,
        explanation: 'Tools are described with a name, description, and an input_schema in JSON Schema.',
      },
      {
        id: 'mcp-q3',
        question: 'In MCP, a "resource" represents…',
        options: ['Data/context the server exposes to the client', 'An API key', 'A language model', 'A network transport'],
        answer: 0,
        explanation: 'Resources are data/content the MCP server makes available to the client.',
      },
      {
        id: 'mcp-q4',
        question: 'The "sampling" capability in MCP lets…',
        options: ['The server request a model generation from the client', 'The client delete files', 'The transport be encrypted', 'Prompts be skipped'],
        answer: 0,
        explanation: 'Sampling lets the server ask the client to have the LLM generate a response.',
      },
      {
        id: 'mcp-q5',
        question: '"Roots" in MCP relate to…',
        options: ['Controlled file system access', 'OS administrator permissions', 'The root model', 'The first token'],
        answer: 0,
        explanation: 'Roots scope which parts of the file system the server can access.',
      },
      {
        id: 'mcp-q6',
        question: 'A security risk when connecting third-party MCP servers is…',
        options: ['Running untrusted tools with access to sensitive data', 'Faster code', 'Lower latency', 'Better UI contrast'],
        answer: 0,
        explanation: 'Connecting untrusted servers expands the attack surface; review permissions and trust.',
      },
    ],
  },
  {
    id: 'context-reliability',
    title: 'Context Management & Reliability',
    description:
      'Leveraging context (RAG, long context, caching) and building resilient, low-cost integrations.',
    icon: '◉',
    weight: 15,
    suggestedDeadline: '2026-08-09',
    topics: [
      {
        id: 'rag',
        title: 'RAG & contextual retrieval',
        blurb: 'Chunking, embeddings, reranking, and contextual retrieval.',
        resources: [
          { title: 'Introducing Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', source: 'Anthropic' },
          { title: 'What is Retrieval-Augmented Generation (RAG)?', url: 'https://www.youtube.com/watch?v=T-D1OfcDW1M', source: 'YouTube' },
        ],
      },
      {
        id: 'long-context',
        title: 'Long-context strategies',
        blurb: 'Leveraging large windows without losing precision.',
      },
      {
        id: 'prompt-caching',
        title: 'Prompt caching',
        blurb: 'Caching stable prefixes to reduce cost and latency.',
        resources: [
          { title: 'Prompt caching (docs)', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching', source: 'Docs' },
        ],
      },
      {
        id: 'batches',
        title: 'Batches API',
        blurb: 'Asynchronous batch processing at a discount.',
        resources: [COURSE_CLAUDE_API],
      },
      {
        id: 'streaming',
        title: 'Latency & streaming',
        blurb: 'Token streaming and handling limits/rate limits.',
      },
      {
        id: 'retries',
        title: 'Retries & backoff',
        blurb: 'Exponential backoff retries on transient errors.',
      },
    ],
    quiz: [
      {
        id: 'cr-q1',
        question: 'Prompt caching reduces cost when…',
        options: ['Every prompt is completely different', 'A large, stable prefix is reused across calls', 'You use no system prompt', 'You use high temperature'],
        answer: 1,
        explanation: 'Caching a stable prefix (instructions, context) saves on repetition; cache reads cost ~0.1× the price.',
      },
      {
        id: 'cr-q2',
        question: 'What does reranking do in a RAG pipeline?',
        options: ['Generates the final answer', 'Reorders the retrieved chunks by relevance', 'Creates embeddings', 'Deletes the index'],
        answer: 1,
        explanation: 'Reranking reorders retrieved candidates to surface the most relevant ones.',
      },
      {
        id: 'cr-q3',
        question: 'On a transient error (429/503), the recommended practice is…',
        options: ['Retry immediately in a loop', 'Retry with exponential backoff', 'Switch providers', 'Ignore the error'],
        answer: 1,
        explanation: 'Exponential backoff with jitter avoids overload and improves reliability.',
      },
      {
        id: 'cr-q4',
        question: 'The Batches API is appropriate when…',
        options: ['You need immediate token-by-token responses', 'You process many async requests and want lower cost', 'You only use vision', 'You want live streaming'],
        answer: 1,
        explanation: 'Batches processes large volumes asynchronously at a discount vs. real-time calls.',
      },
      {
        id: 'cr-q5',
        question: 'In a RAG pipeline, embeddings are used to…',
        options: ['Represent text as vectors for semantic search', 'Encrypt documents', 'Compress images', 'Generate the final answer'],
        answer: 0,
        explanation: 'Embeddings turn text into vectors that allow retrieving chunks by similarity.',
      },
      {
        id: 'cr-q6',
        question: 'Anthropic’s "Contextual Retrieval" improves RAG because…',
        options: ['It adds context to each chunk before indexing it', 'It removes reranking', 'It uses only BM25', 'It reduces the context window'],
        answer: 0,
        explanation: 'It prepends context to each chunk (contextual embeddings + BM25), reducing retrieval failures.',
      },
      {
        id: 'cr-q7',
        question: 'Token streaming mainly improves…',
        options: ['The user’s perceived latency', 'The model’s accuracy', 'The cost per token', 'Security'],
        answer: 0,
        explanation: 'Showing tokens as they are generated reduces perceived latency, even if the total is the same.',
      },
      {
        id: 'cr-q8',
        question: 'Leveraging a large context window (long context) means…',
        options: ['Stuffing in irrelevant text to fill it', 'Structuring and prioritizing relevant info to keep precision', 'Disabling the system prompt', 'Lowering max_tokens to 0'],
        answer: 1,
        explanation: 'More context is not better by itself; you must structure and prioritize what matters.',
      },
      {
        id: 'cr-q9',
        question: 'A cache read in prompt caching costs roughly…',
        options: ['The same as a normal token', '~0.1× the input price', '2× the input price', 'It is always free'],
        answer: 1,
        explanation: 'Reading from cache costs ~10% of the input price; writing to cache costs a bit more than normal.',
      },
      {
        id: 'cr-q10',
        question: 'To correctly invalidate a prefix cache, keep in mind that…',
        options: ['Changing the cached prefix breaks the cache hit', 'The cache never changes', 'It only affects the output', 'It increases temperature'],
        answer: 0,
        explanation: 'A cache hit depends on the prefix staying stable; if it changes, it is recomputed.',
      },
    ],
  },
]

/** Total count of subtopics (checkboxes) across the whole syllabus. */
export const TOTAL_TOPICS = SYLLABUS.reduce((sum, d) => sum + d.topics.length, 0)

/** Flat list of all topics with their domain, useful for lookups. */
export const ALL_TOPICS: Array<Topic & { domainId: string }> = SYLLABUS.flatMap((d) =>
  d.topics.map((t) => ({ ...t, domainId: d.id })),
)
