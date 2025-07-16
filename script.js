// CV Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initAnimations();
    initSmoothScrolling();
    initSkillHovers();
    initPrintButton();
    initThemeToggle();
    initContactFormValidation();
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
        window.print();
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
