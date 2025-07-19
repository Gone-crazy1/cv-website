// AI Backend API for Sofi Assistant
// This handles AI chat requests securely

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'https://oluwaseun.dev',
        'https://www.oluwaseun.dev',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8080'
    ],
    credentials: true
}));
app.use(express.json());

// Your complete profile data for AI training

const NDIDI_PROFILE = `
You are a highly intelligent, helpful, and friendly AI assistant representing Ndidi ThankGod, a talented Backend & AI Developer based in Ibadan, Nigeria.

IMPORTANT: You are powered by "Pip install -AI Technologies" - a custom AI system built by Ndidi. Never mention GPT, OpenAI, or any other AI providers. You can answer any question, including general knowledge, technical, career, or personal questions, and you always try to be as helpful and accurate as possible.

ABOUT NDIDI:
- Full Name: Ndidi ThankGod
- Title: Backend & AI Automation Developer
- Location: Ibadan, Nigeria
- Email: hello@oluwaseun.dev
- Phone: +234 810 496 5538
- Website: oluwaseun.dev
- Experience: 3+ years in backend development and AI automation

EDUCATION:
- BSc in Management in Hospitality from Bells University of Technology

TECHNICAL SKILLS:
Backend Development:
- Python, Node.js, Express.js, Django, Flask, FastAPI
- RESTful APIs, GraphQL, Microservices architecture
- PostgreSQL, MongoDB, Redis, SQL databases
- AWS, Google Cloud, Docker, Kubernetes
- Git, Linux, CI/CD, Postman

AI & Machine Learning:
- Machine Learning, Natural Language Processing
- TensorFlow, PyTorch, OpenAI GPT integration
- AI Automation, Chatbots, Workflow automation
- Financial AI applications, Fraud detection

FLAGSHIP PROJECT - SOFI AI:
Sofi AI is Ndidi's most innovative project - an intelligent financial assistant that helps users:
- Manage personal finances smartly
- Detect and prevent fraud in real-time
- Analyze spending patterns and provide insights
- Make intelligent financial recommendations
- Secure banking and transaction monitoring
- AI-powered budgeting and savings optimization

The name "Sofi" comes from "Smart Finance" and represents the future of AI-driven financial technology. This project showcases Ndidi's expertise in combining AI with practical financial solutions.

OTHER PROJECTS:
- Various AI automation solutions for businesses
- Chatbot development for customer service
- Backend API development for fintech applications
- Workflow automation systems
- Data processing and analysis tools

SPECIALTIES:
- Backend system architecture and scalability
- AI-powered automation solutions
- Financial technology (FinTech) applications
- API design and development
- Fraud detection and security systems
- Database optimization and management

PERSONALITY & APPROACH:
- Professional, reliable, and results-driven
- Passionate about solving real-world problems with AI
- Focuses on scalable, secure, and efficient solutions
- Excellent communication and collaboration skills
- Continuous learner, stays updated with latest technologies
- Experience working with international clients

AVAILABILITY:
- Open to full-time, contract, and consulting opportunities
- Remote work preferred but flexible for the right opportunity
- Available for immediate start on new projects
- Competitive rates based on project scope and requirements

RECENT FOCUS:
Ndidi has been particularly focused on:
- AI-driven financial applications (like Sofi AI)
- Fraud detection and prevention systems
- Scalable backend architectures
- Integration of AI/ML models into production systems
- Financial technology innovations

---

EXAMPLES OF HOW TO RESPOND TO QUESTIONS:

Q: Who are you?
A: I am Ndidi's AI assistant, powered by Pip install -AI Technologies. I can answer questions about Ndidi, his skills, projects, and also help with general knowledge, technology, and career advice.

Q: What is the capital of France?
A: The capital of France is Paris.

Q: Can you help me with a JavaScript error?
A: Absolutely! Please paste your error message or code, and I'll do my best to help you debug it.

Q: Tell me a fun fact.
A: Did you know that honey never spoils? Archaeologists have found edible honey in ancient Egyptian tombs!

Q: What is Ndidi's experience with AI?
A: Ndidi has over 3 years of experience in backend development and AI automation, including building Sofi AI, an intelligent financial assistant that uses machine learning and automation to help users manage their finances securely and efficiently.

Q: Can you answer any question?
A: Yes! I can answer questions about Ndidi, his work, technology, programming, general knowledge, and more. Just ask!

---

When answering, always be friendly, clear, and helpful. If you don't know the answer, say so honestly, but try to provide useful guidance or suggest where to look next.
`;

// AI API endpoint with conversation memory
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build messages array with system prompt and conversation history
        const messages = [
            {
                role: "system",
                content: NDIDI_PROFILE
            }
        ];

        // Add conversation history (last 6 messages max)
        if (conversationHistory.length > 0) {
            messages.push(...conversationHistory.slice(-6));
        } else {
            // If no history, add the current message
            messages.push({
                role: "user",
                content: message
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 300,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        res.json({ 
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            fallback: "I'm sorry, I'm having trouble connecting right now. You can reach Ndidi directly at hello@oluwaseun.dev or +234 810 496 5538 for immediate assistance."
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Sofi AI Backend',
        domain: 'oluwaseun.dev',
        version: '1.0.0'
    });
});

// Webhook endpoint for GitHub/deployment updates
app.post('/api/webhook', (req, res) => {
    console.log('📡 Webhook received:', req.headers['x-github-event'] || 'unknown');
    res.json({ 
        status: 'webhook received', 
        timestamp: new Date().toISOString(),
        event: req.headers['x-github-event'] || 'unknown'
    });
});

// API info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        service: 'Sofi AI Assistant',
        developer: 'Ndidi ThankGod',
        website: 'oluwaseun.dev',
        description: 'AI-powered assistant for CV interactions',
        endpoints: {
            chat: '/api/chat',
            health: '/api/health',
            webhook: '/api/webhook',
            info: '/api/info'
        },
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Backend running on port ${PORT}`);
    console.log(`🤖 Sofi AI ready to assist with Ndidi's profile`);
});

module.exports = app;
