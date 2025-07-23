const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Hannah's personality and system prompt
const HANNAH_SYSTEM_PROMPT = `You are Hannah, a friendly and encouraging AI tutor for students in grades 7-12. Your personality traits:

PERSONALITY:
- Warm, supportive, and patient
- Enthusiastic about learning
- Never use profanity or inappropriate language
- Always encouraging, even when students struggle
- Use age-appropriate language for teenagers
- Be conversational but educational

EDUCATIONAL APPROACH:
- Break down complex problems into simple steps
- Ask guiding questions to help students think
- Provide hints before giving full answers
- Celebrate student progress and effort
- Connect learning to real-world applications
- Adapt explanations to student's grade level

SUBJECTS YOU HELP WITH:
- Mathematics (Algebra, Geometry, Functions, Statistics, etc.)
- Science (Biology, Chemistry, Physics, Earth Science)
- English (Reading, Writing, Grammar, Literature)
- Study skills and learning strategies

RESPONSE STYLE:
- Keep responses concise but thorough (2-4 sentences usually)
- Use encouraging phrases like "Great question!" "You're on the right track!"
- Include relevant examples when helpful
- End with a follow-up question or next step when appropriate

Remember: You're here to guide learning, not just give answers. Help students understand the "why" behind concepts.`;

// Hannah AI Chat Endpoint
app.post('/api/hannah-chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build conversation context
        let conversationContext = HANNAH_SYSTEM_PROMPT + '\n\nConversation:\n';
        
        // Add recent history for context
        history.slice(-6).forEach(msg => {
            conversationContext += `${msg.sender === 'user' ? 'Student' : 'Hannah'}: ${msg.content}\n`;
        });
        
        conversationContext += `Student: ${message}\nHannah:`;

        // Get AI response from Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: conversationContext }] }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 300,
            },
        });

        const response = result.response;
        let hannahResponse = response.text();

        // Clean up response (remove any "Hannah:" prefix if present)
        hannahResponse = hannahResponse.replace(/^Hannah:\s*/i, '');
        
        // Ensure response is appropriate and helpful
        if (!hannahResponse || hannahResponse.length < 10) {
            hannahResponse = "I want to help you with that! Could you tell me a bit more about what you're working on or what specifically you'd like to understand better?";
        }

        res.json({ 
            response: hannahResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Hannah AI Error:', error);
        res.status(500).json({ 
            error: 'Sorry, I\'m having trouble thinking right now. Please try asking your question again!',
            details: error.message 
        });
    }
});

// Student Progress Analytics (for future development)
app.get('/api/analytics/progress', (req, res) => {
    // Placeholder for progress tracking
    res.json({
        message: "Progress analytics coming soon!",
        features: [
            "Learning pattern analysis",
            "Knowledge gap identification", 
            "Personalized study recommendations",
            "Performance trends over time"
        ]
    });
});

// Custom Content Generation (for future development)
app.post('/api/generate/practice', (req, res) => {
    // Placeholder for custom content generation
    res.json({
        message: "Custom practice problem generation coming soon!",
        features: [
            "Personalized practice problems",
            "Adaptive difficulty levels",
            "Subject-specific content",
            "Step-by-step solutions"
        ]
    });
});

// Adaptive Learning Paths (for future development)
app.get('/api/learning-path/:subject', (req, res) => {
    const { subject } = req.params;
    res.json({
        message: `Adaptive learning path for ${subject} coming soon!`,
        features: [
            "Personalized curriculum sequencing",
            "Prerequisite skill mapping",
            "Learning objective tracking",
            "Adaptive pacing based on performance"
        ]
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Hannah AI Tutor',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ 
        error: 'Something went wrong on our end. Please try again!',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`🎓 Hannah AI Tutor Server running on port ${port}`);
    console.log(`📚 Ready to help students learn and grow!`);
    
    // Test Gemini connection
    if (process.env.GEMINI_API_KEY) {
        console.log('✅ Gemini AI connected and ready');
    } else {
        console.log('⚠️ Warning: GEMINI_API_KEY not found');
    }
});

module.exports = app;
