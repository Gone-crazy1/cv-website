// CV Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initAnimations();
    initSmoothScrolling();
    initSkillHovers();
    initPrintButton();
    initThemeToggle();
    initContactFormValidation();
    initAIAssistant();
});

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for skill tags
                if (entry.target.classList.contains('skills-list')) {
                    const skillTags = entry.target.querySelectorAll('.skill-tag');
                    skillTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
                            tag.style.opacity = '0';
                            tag.style.animationFillMode = 'forwards';
                        }, index * 50);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Observe skill lists for staggered animation
    document.querySelectorAll('.skills-list').forEach(list => {
        observer.observe(list);
    });
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced skill tag interactions
function initSkillHovers() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add ripple effect
            createRippleEffect(this);
            
            // Highlight related skills (simple implementation)
            highlightRelatedSkills(this);
        });
        
        tag.addEventListener('mouseleave', function() {
            // Remove highlights
            removeSkillHighlights();
        });
    });
}

// Create ripple effect for skill tags
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Highlight related skills (basic grouping)
function highlightRelatedSkills(hoveredTag) {
    const skillText = hoveredTag.textContent.toLowerCase();
    const allTags = document.querySelectorAll('.skill-tag');
    
    // Define skill relationships
    const skillGroups = {
        'python': ['flask', 'fastapi', 'django'],
        'flask': ['python', 'fastapi'],
        'fastapi': ['python', 'flask'],
        'supabase': ['postgresql', 'sql'],
        'postgresql': ['supabase', 'sql'],
        'sql': ['postgresql', 'supabase'],
        'docker': ['git', 'github actions'],
        'git': ['docker', 'github actions'],
        'openai': ['langchain', 'prompt engineering'],
        'langchain': ['openai', 'prompt engineering']
    };
    
    const relatedSkills = skillGroups[skillText] || [];
    
    allTags.forEach(tag => {
        const tagText = tag.textContent.toLowerCase();
        if (relatedSkills.includes(tagText) && tag !== hoveredTag) {
            tag.style.background = '#3b82f6';
            tag.style.transform = 'scale(1.05)';
            tag.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        }
    });
}

// Remove skill highlights
function removeSkillHighlights() {
    const allTags = document.querySelectorAll('.skill-tag');
    allTags.forEach(tag => {
        tag.style.background = '';
        tag.style.transform = '';
        tag.style.boxShadow = '';
    });
}

// Print functionality
function initPrintButton() {
    // Create print button
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print CV';
    printButton.className = 'print-button';
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: var(--shadow-md);
        transition: var(--transition);
        z-index: 1000;
    `;
    
    printButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--secondary-color)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--primary-color)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-md)';
    });
    
    printButton.addEventListener('click', function() {
        // Open PDF version in new tab instead of printing the website
        window.open('cv-pdf.html', '_blank');
    });
    
    document.body.appendChild(printButton);
    
    // Hide print button when printing
    window.addEventListener('beforeprint', function() {
        printButton.style.display = 'none';
    });
    
    window.addEventListener('afterprint', function() {
        printButton.style.display = 'flex';
    });
}

// Theme toggle functionality
function initThemeToggle() {
    // Create theme toggle button
    const themeButton = document.createElement('button');
    themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    themeButton.className = 'theme-toggle';
    themeButton.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--surface);
        color: var(--text-primary);
        border: 1px solid var(--border);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
        transition: var(--transition);
        z-index: 1000;
    `;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('cv-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('cv-theme', isDark ? 'dark' : 'light');
    });
    
    document.body.appendChild(themeButton);
}

// Contact form validation (for future contact form)
function initContactFormValidation() {
    // This is a placeholder for future contact form functionality
    // Can be expanded when a contact form is added
    console.log('Contact form validation initialized');
}

// Utility function to copy email to clipboard
function copyEmailToClipboard() {
    const email = 'hello@oluwaseun.dev';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Email copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
        document.body.removeChild(textArea);
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-md);
        z-index: 1001;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add click to copy functionality to email
document.addEventListener('DOMContentLoaded', function() {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            copyEmailToClipboard();
        });
        
        emailLink.style.cursor = 'pointer';
        emailLink.title = 'Click to copy email address';
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'P' to print
    if (e.key === 'p' || e.key === 'P') {
        if (e.ctrlKey || e.metaKey) {
            return; // Let browser handle Ctrl+P
        } else {
            e.preventDefault();
            window.print();
        }
    }
    
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const themeButton = document.querySelector('.theme-toggle');
            if (themeButton) {
                themeButton.click();
            }
        }
    }
});

// Add CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 100%);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Dark theme styles */
    .dark-theme {
        --background: #111827;
        --surface: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-light: #9ca3af;
        --border: #374151;
        --border-light: #4b5563;
    }
    
    .dark-theme .header {
        background: linear-gradient(135deg, #1e40af 0%, #7c2d12 100%) !important;
    }
    
    .dark-theme .hire-me-section {
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        border-color: var(--primary-color);
    }
    
    .dark-theme .value-item,
    .dark-theme .commitment-box {
        background: var(--surface);
        border-color: var(--border);
    }
    
    .dark-theme .call-to-action {
        background: linear-gradient(135deg, #1e40af 0%, #7c2d12 100%);
    }
    
    @media (max-width: 768px) {
        .print-button,
        .theme-toggle {
            top: 10px;
            right: 10px;
        }
        
        .theme-toggle {
            top: 70px;
        }
    }
`;

document.head.appendChild(additionalStyles);

// AI Assistant Functionality
function initAIAssistant() {
    const chatToggle = document.getElementById('aiChatToggle');
    const chatContainer = document.getElementById('aiChatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatClear = document.getElementById('chatClear');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Configuration
    const AI_CONFIG = {
        // Use oluwaseun.dev for production or localhost for development
        apiUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api/chat'
            : 'https://sofi-ai-backend.onrender.com/api/chat', // Your Render deployment
        fallbackEnabled: true,
        maxRetries: 2,
        timeout: 15000
    };

    // Conversation memory to maintain context
    let conversationHistory = [];

    // Fallback knowledge base (used when API is unavailable)
    const fallbackKnowledgeBase = {
        skills: {
            backend: ["Python", "Node.js", "Express.js", "Django", "Flask", "FastAPI", "RESTful APIs", "GraphQL"],
            ai: ["Machine Learning", "Natural Language Processing", "TensorFlow", "PyTorch", "OpenAI GPT", "AI Automation"],
            database: ["PostgreSQL", "MongoDB", "Redis", "SQL"],
            cloud: ["AWS", "Google Cloud", "Docker", "Kubernetes"],
            tools: ["Git", "Linux", "CI/CD", "Postman"]
        },
        experience: {
            years: "3+ years",
            focus: "Backend development and AI automation solutions",
            specialties: ["API development", "AI chatbots", "Automation workflows", "Financial technology"]
        },
        projects: {
            sofi: "Sofi AI - An intelligent financial assistant that helps users manage finances, detect fraud, and make smart financial decisions using advanced AI algorithms",
            automation: "Various AI automation projects for businesses including chatbots, workflow automation, and data processing"
        },
        education: "BSc in Management in Hospitality from Bells University of Technology",
        location: "Ibadan, Nigeria",
        contact: {
            email: "hello@oluwaseun.dev",
            phone: "+234 810 496 5538",
            website: "oluwaseun.dev"
        }
    };

    // AI API call with fallback and conversation memory
    async function getAIResponse(message, retryCount = 0) {
        try {
            // Show that we're using real AI
            console.log('🤖 Asking AI about:', message);
            
            // Add user message to conversation history
            conversationHistory.push({
                role: "user",
                content: message
            });

            // Keep only last 6 messages (3 exchanges) to avoid token limits
            if (conversationHistory.length > 6) {
                conversationHistory = conversationHistory.slice(-6);
            }
            
            const response = await fetch(AI_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    conversationHistory 
                }),
                signal: AbortSignal.timeout(AI_CONFIG.timeout)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.response) {
                console.log('✅ AI Response received');
                // Add AI response to conversation history
                conversationHistory.push({
                    role: "assistant",
                    content: data.response
                });
                return data.response;
            } else if (data.fallback) {
                console.log('⚠️ Using API fallback response');
                return data.fallback;
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('❌ AI API Error:', error);
            
            // Retry logic
            if (retryCount < AI_CONFIG.maxRetries && error.name !== 'AbortError') {
                console.log(`🔄 Retrying... (${retryCount + 1}/${AI_CONFIG.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return getAIResponse(message, retryCount + 1);
            }
            
            // Use fallback if enabled
            if (AI_CONFIG.fallbackEnabled) {
                console.log('🔄 Using local fallback response');
                return generateFallbackResponse(message);
            }
            
            return "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment, or reach out to Ndidi directly at hello@oluwaseun.dev!";
        }
    }

    // Fallback response generator (original pattern matching)
    function generateFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greeting responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm Sofi, Ndidi's AI assistant powered by Pip install -AI Technologies. I'm here to help you learn more about his background, skills, and projects. What would you like to know?";
        }
        
        // Skills inquiries
        if (message.includes('skill') || message.includes('technology') || message.includes('tech stack')) {
            return `Ndidi is skilled in:\n\n🔧 **Backend**: ${fallbackKnowledgeBase.skills.backend.join(', ')}\n\n🤖 **AI/ML**: ${fallbackKnowledgeBase.skills.ai.join(', ')}\n\n💾 **Databases**: ${fallbackKnowledgeBase.skills.database.join(', ')}\n\n☁️ **Cloud**: ${fallbackKnowledgeBase.skills.cloud.join(', ')}\n\nHe has ${fallbackKnowledgeBase.experience.years} of experience focusing on ${fallbackKnowledgeBase.experience.focus}.`;
        }
        
        // Experience inquiries
        if (message.includes('experience') || message.includes('work') || message.includes('background')) {
            return `Ndidi has ${fallbackKnowledgeBase.experience.years} of professional experience in ${fallbackKnowledgeBase.experience.focus}. His specialties include ${fallbackKnowledgeBase.experience.specialties.join(', ')}. He's passionate about building scalable backend systems and innovative AI solutions.`;
        }
        
        // Project inquiries
        if (message.includes('project') || message.includes('sofi') || message.includes('portfolio')) {
            return `Here are some of Ndidi's notable projects:\n\n🤖 **Sofi AI**: ${fallbackKnowledgeBase.projects.sofi}\n\n⚡ **AI Automation**: ${fallbackKnowledgeBase.projects.automation}\n\nHe's always working on innovative solutions that combine AI with practical business applications.`;
        }
        
        // Contact inquiries
        if (message.includes('contact') || message.includes('hire') || message.includes('reach')) {
            return `You can reach Ndidi through:\n\n📧 Email: ${fallbackKnowledgeBase.contact.email}\n📱 Phone: ${fallbackKnowledgeBase.contact.phone}\n🌐 Website: ${fallbackKnowledgeBase.contact.website}\n\nHe's always open to discussing new opportunities and collaborations!`;
        }
        
        // Default response
        return "I'd be happy to help you learn more about Ndidi! You can ask me about his skills, experience, projects, education, or how to contact him. What specific information are you looking for?";
    }

    // Toggle chat visibility
    function toggleChat() {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            // Add initial message if empty
            if (chatMessages.children.length === 1) {
                setTimeout(() => {
                    addMessage("Hello! I'm Sofi, powered by Pip install -AI Technologies. I can answer any questions about Ndidi's skills, experience, and projects. What would you like to know? 🚀");
                }, 500);
            }
        }
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="message-content">
                <p>${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <p style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Pip install -AI Technologies is thinking...</p>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    // Send message
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Disable input while processing
        chatInput.disabled = true;
        chatSend.disabled = true;
        
        // Add user message
        addMessage(message, true);
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        try {
            // Get AI response
            const response = await getAIResponse(message);
            typingIndicator.remove();
            addMessage(response);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            typingIndicator.remove();
            addMessage("I apologize, but I'm having trouble right now. Please try again or contact Ndidi directly at hello@oluwaseun.dev");
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    // Clear conversation
    function clearConversation() {
        conversationHistory = [];
        // Remove all messages except the initial one
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (index > 0) { // Keep the first message
                message.remove();
            }
        });
        console.log('🔄 Conversation cleared');
    }

    // Event listeners
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatClear.addEventListener('click', clearConversation);
    chatSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Close chat when clicking outside (but not when typing)
    document.addEventListener('click', (e) => {
        if (!chatContainer.contains(e.target) && 
            !chatToggle.contains(e.target) && 
            !chatInput.contains(e.target) &&
            document.activeElement !== chatInput) {
            chatContainer.classList.remove('active');
        }
    });

    // Prevent chat from closing when interacting with input
    chatInput.addEventListener('focus', (e) => {
        e.stopPropagation();
    });

    chatInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Test API connection on load
    setTimeout(async () => {
        try {
            const response = await fetch(AI_CONFIG.apiUrl.replace('/chat', '/health'));
            if (response.ok) {
                console.log('✅ AI Backend connected successfully');
            }
        } catch (error) {
            console.log('⚠️ AI Backend not available, using fallback mode');
        }
    }, 1000);
}
