export interface ServiceDetail {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problems: string[];
  deliverables: { icon: string; title: string; content: string }[];
  technologies: string[];
}

export const services: ServiceDetail[] = [
  {
    slug: "ai-automation",
    name: "AI Automation",
    tagline: "Let AI handle the parts of your workflow that used to need a person reading, deciding, and typing.",
    description:
      "AI Automation applies AI models to tasks that involve interpreting unstructured input — documents, messages, requests — rather than just following fixed rules. It sits alongside your existing workflow automation, handling the steps that require judgment.",
    problems: [
      "Someone manually reads and re-types information from documents or emails",
      "Customer questions sit in a queue waiting for a human to triage them",
      "Your team keeps answering the same internal questions over and over",
    ],
    deliverables: [
      { icon: "FaFileLines", title: "Intelligent Document Processing", content: "Extract, classify, and route information from documents automatically, even when they don't follow a fixed template." },
      { icon: "FaHeadset", title: "Customer Support Automation", content: "Automate first-line responses and routing so your team only handles what actually needs a human." },
      { icon: "FaBrain", title: "Internal Knowledge Assistants", content: "Give your team instant, accurate answers pulled from your own documentation and systems." },
      { icon: "FaWandMagicSparkles", title: "Automated Decision Workflows", content: "Apply consistent, AI-assisted judgment to repetitive decisions that used to need manual review." },
    ],
    technologies: ["OpenAI", "Claude", "Gemini", "LangChain", "Hugging Face"],
  },
  {
    slug: "ai-agents",
    name: "AI Agents",
    tagline: "Purpose-built agents that handle a specific job in your business — not a generic chatbot bolted onto your website.",
    description:
      "An AI agent is software that can take a goal, reason about the steps needed, and act — calling tools, checking systems, and following up — rather than just answering a single question. We design and build agents scoped to one real job at a time.",
    problems: [
      "A workflow needs to check several systems and make a call before acting",
      "You want automation that can handle variation, not just a fixed script",
      "Multiple tools need to be orchestrated together to complete one task",
    ],
    deliverables: [
      { icon: "FaRobot", title: "Custom AI Agents", content: "Agents built around one specific business task, with clear boundaries on what they can and can't do." },
      { icon: "FaDiagramProject", title: "Multi-Agent Workflow Orchestration", content: "Multiple agents coordinating on a larger workflow, each responsible for a defined part of it." },
      { icon: "FaLink", title: "Agent-to-System Integration", content: "Agents that can actually call your CRM, database, or internal APIs — not just talk about doing it." },
      { icon: "FaUserCheck", title: "Human-in-the-Loop Oversight", content: "Approval checkpoints built in wherever a decision shouldn't be fully automated yet." },
    ],
    technologies: ["Claude", "OpenAI", "LangChain", "n8n", "MCP"],
  },
  {
    slug: "crm-automation",
    name: "CRM Automation",
    tagline: "Make sure leads that come in actually get captured, followed up on, and tracked — automatically.",
    description:
      "CRM & Sales Automation covers getting leads into your CRM, moving them through a defined pipeline, and triggering follow-up without relying on someone remembering to do it manually.",
    problems: [
      "Leads from your website, calls, or socials don't consistently land in your CRM",
      "Follow-up depends on someone being free and remembering to send it",
      "Pipeline stages don't reflect where deals actually are",
    ],
    deliverables: [
      { icon: "FaAddressBook", title: "CRM Implementation", content: "Set up and configure your CRM around how your sales process actually works." },
      { icon: "FaFilter", title: "Lead Qualification Workflows", content: "Automatically score and route leads so your team focuses on the ones worth their time." },
      { icon: "FaChartLine", title: "Sales Pipeline Automation", content: "Deals move between stages automatically based on the actions a lead actually takes." },
      { icon: "FaClock", title: "Follow-Up Automation", content: "Trigger timely follow-up sequences the moment a lead is created, every time." },
    ],
    technologies: ["Salesforce", "Airtable", "Make", "n8n"],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    tagline: "Replace the repetitive, multi-step tasks your team does by hand every day or every week.",
    description:
      "Business Process Automation covers rule-based, repeatable workflows — approvals, data entry, reporting — that don't need AI judgment, just structure and reliability.",
    problems: [
      "The same multi-step task happens every day or every week, by hand",
      "Data gets copied manually between two or more systems",
      "A process regularly stalls waiting on one person to notice and act",
    ],
    deliverables: [
      { icon: "FaDiagramProject", title: "Workflow & Approval Automation", content: "Replace manual hand-offs and email chains with structured, trackable approval workflows." },
      { icon: "FaKeyboard", title: "Data Entry Automation", content: "Eliminate repetitive, error-prone manual data entry between systems." },
      { icon: "FaChartSimple", title: "Reporting Automation", content: "Recurring reports that generate themselves from the data you already have." },
      { icon: "FaGears", title: "Operational Process Optimisation", content: "Identify and remove the specific bottlenecks slowing your team down." },
    ],
    technologies: ["n8n", "Make", "Airtable"],
  },
  {
    slug: "system-integration",
    name: "System Integration",
    tagline: "Stop manually copying data between the tools you already use — connect them properly.",
    description:
      "System Integration & API Development connects your CRM, accounting, support, and marketing tools so data flows between them automatically, through direct APIs, automation platforms, or custom middleware depending on what each system supports.",
    problems: [
      "The same data gets copied by hand between two or more tools",
      "Your tools don't offer a built-in integration for what you need",
      "You're hitting the limits of no-code automation platforms at higher volume",
    ],
    deliverables: [
      { icon: "FaPlug", title: "Third-Party Integrations", content: "Connect your existing tools directly through their APIs wherever that's the more reliable option." },
      { icon: "FaCode", title: "API Development", content: "Build and expose APIs where your systems need to talk to each other or to outside partners." },
      { icon: "FaNetworkWired", title: "Webhook Integrations", content: "One system notifies another the moment something happens, instead of checking on a schedule." },
      { icon: "FaBolt", title: "Custom Middleware", content: "A small service that sits between systems when off-the-shelf options can't handle your volume or logic." },
    ],
    technologies: ["GitHub", "Resend", "Sanity", "Supabase", "Vercel"],
  },
];

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}
