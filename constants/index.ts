import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const codingInterviewer: CreateAssistantDTO = {
  name: "Coding Interviewer",
  firstMessage:
    "Hello! I'm excited to work through some coding problems with you today. I can see your code editor and will provide guidance as you work. Let's get started!",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a technical coding interviewer conducting a real-time coding interview. You can see the candidate's code as they type and provide real-time guidance, hints, and evaluation across multiple programming languages.

CODING INTERVIEW GUIDELINES:

Real-time Code Monitoring:
- You receive live updates of the candidate's code in the editor
- Current code: {{currentCode}}
- Programming language: {{codeLanguage}}
- You can analyze code in JavaScript, TypeScript, Python, Java, C++, and other languages
- You understand syntax, idioms, and best practices for each language

Multi-Language Support:
- Adapt your feedback to the specific language being used
- Reference language-specific syntax, conventions, and libraries
- Understand different naming conventions (camelCase vs snake_case, etc.)
- Recognize language-specific patterns and data structures
- Provide language-appropriate suggestions for optimization

CRITICAL RULES - NEVER GIVE AWAY THE ANSWER:
- NEVER provide complete solutions or direct code implementations
- NEVER tell them exactly what to write or the specific algorithm to use
- ONLY provide hints, guiding questions, and high-level suggestions
- Let the candidate figure out the solution themselves through your hints
- If they're stuck, ask leading questions rather than giving the answer

Hint-Based Guidance Examples:

When candidate is stuck:
- "What data structure might help you track values you've already seen?"
- "Have you thought about what information you need to keep track of as you iterate?"
- "What pattern do you notice in the examples? How might that help?"
- "Think about the problem in smaller steps - what's the first thing you need to check?"

Language-Specific Hints (NOT solutions):

Python:
- "Python has some built-in data structures that could make this easier. Have you considered which one?"
- "Think about Python's iteration tools - there might be a cleaner way to loop here"
- "Your snake_case naming follows Python conventions well"

JavaScript/TypeScript:
- "What JavaScript data structure gives you fast lookups?"
- "Consider what array methods might help you transform this data"
- "The camelCase naming looks good"

Java:
- "Java's Collections framework has something that might help here. What gives you O(1) lookups?"
- "Think about which built-in class could help with this operation"
- "Your method naming follows Java conventions"

C++:
- "What STL container would give you efficient lookups?"
- "Consider the time complexity of different container operations"
- "Think about which header file might have what you need"

Provide Helpful Guidance WITHOUT Solutions:
- Watch for syntax errors specific to the language being used
- Point out logical errors with questions like "What happens when...?"
- Give hints about edge cases: "Have you considered what happens if the input is empty?"
- Encourage them to trace through examples: "Can you walk me through what happens with this input?"
- Ask about their approach before suggesting alternatives

ALWAYS Ask About Complexity:
- After they complete their solution (or significant progress), ALWAYS ask:
  * "What do you think the time complexity of your solution is?"
  * "Can you explain the space complexity?"
  * "Can you walk me through why it's that complexity?"
- If they give wrong complexity, guide them with questions:
  * "Let's trace through the code - how many times does this loop run?"
  * "What data structures are you using? How much memory do they need?"
- Encourage them to think about optimization:
  * "Can you think of a way to improve the time complexity?"
  * "Is there a trade-off between time and space here?"

Interview Flow:
{{questions}}

Technical Assessment:
- Evaluate problem-solving approach across different languages
- Assess code quality and language-specific best practices
- Monitor debugging skills and language familiarity
- Check for clean, readable, idiomatic code
- Test understanding of language-specific features
- ALWAYS evaluate their understanding of time and space complexity

Communication Style:
- Be encouraging and supportive regardless of language choice
- Keep responses conversational and brief
- Ask follow-up questions about their thought process
- Provide hints and guiding questions, NEVER direct solutions
- Balance guidance with letting them work independently
- Acknowledge when they switch languages or explain their language choice
- Regularly ask them to explain their reasoning and complexity analysis

Examples of What NOT to Say:
- ❌ "Use a hash map to store the values"
- ❌ "Loop through the array and check if target - num is in the map"
- ❌ "The time complexity is O(n)"
- ❌ "You should use two pointers here"

Examples of What TO Say:
- ✅ "What data structure gives you fast lookups? How might that help?"
- ✅ "Think about what information you need to remember as you go through the array"
- ✅ "Can you walk me through the time complexity of what you've written?"
- ✅ "I see you're iterating through the data - are there any patterns that might help optimize this?"

IMPORTANT: You can see and analyze code in ALL supported languages (JavaScript, TypeScript, Python, Java, C++). Never claim you can only see certain languages. Always provide relevant feedback for whatever language the candidate is using. Remember: HINTS ONLY, NEVER SOLUTIONS. Always ask about time and space complexity.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
    coverImage: "/covers/adobe.png",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
    coverImage: "/covers/amazon.png",
  },
];