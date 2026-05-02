export const allProjects = [
  {
    title: "skill-pull",
    slug: "skill-pull",
    category: "MCP Server",
    year: "2026",
    href: "/work/skill-pull",
    image: "/images/work/skill-pull/thumbnail.png",
    imagefit: "contain",
    tagline:
      "MCP server that auto-discovers and installs the right agent skills from skills.sh before your AI builds anything.",
    description:
      "Before your AI agent writes a single line of code, skill-pull searches skills.sh semantically, installs matching skills into your project's .cursor/skills/ directory, and loads their knowledge into context — automatically. Works with Cursor, Claude Code, Windsurf, and any MCP-compatible agent.",
    tags: ["MCP", "AI Agent", "Node.js", "skills.sh", "Cursor", "Developer Tools"],
    github: "https://github.com/rohangore1999/skill-pull",
    live: "https://www.npmjs.com/package/@rohangore1999/skill-pull",
    liveLabel: "npm",
    blog: "/blog/skill-pull",
    media: [
      {
        type: "image",
        src: "/images/work/skill-pull/thumbnail.png",
      },
    ],
  },
  {
    title: "CodeJump",
    slug: "code-jump",
    category: "VS Code Extension",
    year: "2026",
    href: "/work/code-jump",
    image: "/images/work/code-jump/image.png",
    tagline:
      "Copy code locations as references and jump to them instantly across your team.",
    description:
      "A VS Code extension that creates shareable code references like @file.js (42). Copy with Cmd+Shift+C, paste anywhere, and navigate instantly with Cmd+Shift+V. Features smart clipboard monitoring, context menus, and status bar integration.",
    tags: ["VS Code Extension", "JavaScript", "Developer Tools", "Productivity"],
    github: "https://github.com/rohangore1999/code-jump",
    live: "https://marketplace.visualstudio.com/items?itemName=RohanGore1999.codejump-navigator",
    liveLabel: "VS Code Marketplace",
    blog: "/blog/code-jump",
    media: [
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/4RKHO_xOqdo?autoplay=1&mute=1&loop=1&playlist=4RKHO_xOqdo",
      },
    ],
  },
  {
    title: "Applique",
    slug: "applique",
    category: "Design & Development",
    year: "2024",
    href: "/work/applique",
    image: "/images/work/applique/thumbnail.png",
    tagline:
      "RAG-powered design system assistant for Myntra's Appliqué component library.",
    description:
      "Tired of tab-switching to read docs mid-code, I built a RAG assistant that answers Appliqué component questions right inside the IDE — powered by Qdrant, OpenAI, and an MCP server.",
    tags: ["RAG", "LLM", "Python", "MCP", "Qdrant", "OpenAI"],
    github: "https://github.com/rohangore1999/Myntra-Applique-RAG",
    live: null,
    blog: "/blog/applique-rag",
    media: [
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/vLn42fOYQgQ?autoplay=1&mute=1&loop=1&playlist=vLn42fOYQgQ",
      },
    ],
  },
  {
    title: "YT Chrome Extension",
    slug: "yt-chrome-extension",
    category: "AI & Browser Extension",
    year: "2024",
    href: "/work/yt-chrome-extension",
    image: "/images/work/yt-chrome-extension/yt-video-chat.png",
    tagline:
      "Chrome extension that lets you have AI conversations with any YouTube video using its transcript and Gemini embeddings.",
    description:
      "Point it at any YouTube video, and you can ask questions, get summaries, and jump to timestamps — all powered by RAG over the video transcript stored in Qdrant.",
    tags: ["Chrome Extension", "RAG", "Qdrant", "Gemini", "React", "Python"],
    github: "https://github.com/rohangore1999/yt-chrome-extension",
    live: "https://chromewebstore.google.com/detail/ai-video-assistant-chat-w/cmgnigapcjfijpijcdaaiaiicgonndhn",
    liveLabel: "Chrome Store",
    blog: "/blog/yt-chrome-extension",
    media: [
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/MfmC7j_PRlg?autoplay=1&mute=1&loop=1&playlist=MfmC7j_PRlg",
      },
    ],
  },
  {
    title: "Ecommerce Agent",
    slug: "ecommerce-agent",
    category: "AI & Voice",
    year: "2025",
    href: "/work/ecommerce-agent",
    image: "/images/work/ecommerce-agent/thumbnail.png",
    tagline:
      "Voice-enabled AI shopping agent — talk to it, add to cart, get recommendations, or hand off to a real human support agent.",
    description:
      "Built with OpenAI GPT-4.1 and the Agents SDK. Full cart operations via natural language, voice in and voice out via Web Speech API and OpenAI TTS, plus a human-in-the-loop handoff when the AI can't help.",
    tags: ["OpenAI", "Agents SDK", "Voice", "React", "Node.js", "Python"],
    github: "https://github.com/rohangore1999/ecommerce-agent",
    live: null,
    blog: "/blog/ecommerce-agent",
    media: [
      {
        type: "youtube",
        src: "https://www.youtube.com/embed/infmGNXBTj8?autoplay=1&mute=1&loop=1&playlist=infmGNXBTj8",
      },
    ],
  },
];
