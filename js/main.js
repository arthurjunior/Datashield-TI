/**
 * MAIN JAVASCRIPT - SITE FUNCTIONALITY
 */

// Animate stats counter with smooth easing
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;
        
        if (progress < 1) {
            const value = target.toString().includes('.') ? current.toFixed(1) : Math.floor(current);
            element.textContent = value;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// Initialize stats animation when in viewport
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe hero stats section
document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    
    // Smooth scroll for anchor links
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
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const isActive = linkHref === currentPage || 
                        (currentPage === '' && linkHref === 'index.html') ||
                        (currentPage === 'index.html' && linkHref === 'index.html');
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Handle diagnosis form submission
    const diagnosisForm = document.getElementById('diagnosisForm');
    if (diagnosisForm) {
        diagnosisForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('diagnosis-name').value.trim();
            const whatsapp = document.getElementById('diagnosis-whatsapp').value.trim();
            const company = document.getElementById('diagnosis-company').value.trim();
            const neighborhood = document.getElementById('diagnosis-neighborhood').value.trim();
            const problem = document.getElementById('diagnosis-problem').value.trim();
            
            let message = `Olá, sou ${name}`;
            if (company) {
                message += `, da empresa ${company}`;
            }
            message += `, moro no bairro ${neighborhood} e preciso de ajuda com ${problem}.`;
            
            const whatsappUrl = `https://wa.me/5592996092339?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Handle mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Handle chatbot
    let chatbotState = {
        step: 1,
        type: '',
        problem: ''
    };
    
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotActions = document.getElementById('chatbotActions');
    
    if (chatbotToggle && chatbotWindow && chatbotClose && chatbotMessages && chatbotActions) {
        function addBotMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message bot-message';
            messageDiv.innerHTML = `
                <div class="chat-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                    </svg>
                </div>
                <div class="chat-content">
                    <p>${text}</p>
                </div>
            `;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        function setActions(buttons) {
            chatbotActions.innerHTML = '';
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = `chat-action-btn ${btn.class || ''}`;
                button.textContent = btn.text;
                button.dataset.step = btn.step;
                button.dataset.value = btn.value;
                button.addEventListener('click', handleActionClick);
                chatbotActions.appendChild(button);
            });
        }
        
        function handleActionClick(e) {
            const step = e.target.dataset.step;
            const value = e.target.dataset.value;
            
            if (step === 'type') {
                chatbotState.type = value;
                addBotMessage('Qual problema você está enfrentando?');
                setActions([
                    { text: 'Wi-Fi lento', step: 'problem', value: 'Wi-Fi lento' },
                    { text: 'Rede', step: 'problem', value: 'problema de rede' },
                    { text: 'Infraestrutura', step: 'problem', value: 'infraestrutura' },
                    { text: 'CFTV', step: 'problem', value: 'CFTV' },
                    { text: 'Computadores', step: 'problem', value: 'computadores lentos' },
                    { text: 'Outro', step: 'problem', value: 'outro problema' }
                ]);
            } else if (step === 'problem') {
                chatbotState.problem = value;
                addBotMessage('Perfeito. Vamos continuar o atendimento no WhatsApp.');
                setActions([
                    { text: 'Falar agora', step: 'whatsapp', class: 'whatsapp' }
                ]);
            } else if (step === 'whatsapp') {
                let message = `Olá, vim pelo site da DATASHIELD TI. Preciso de ajuda para ${chatbotState.type === 'empresa' ? 'minha empresa' : 'minha residência'} com ${chatbotState.problem}.`;
                const whatsappUrl = `https://wa.me/5592996092339?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
        }
        
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
        
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }
});

