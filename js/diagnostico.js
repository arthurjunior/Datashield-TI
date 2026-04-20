/**
 * DIAGNÓSTICO LGPD LÓGICA
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referências DOM
    const heroSection = document.getElementById('hero-section');
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    
    const startBtn = document.getElementById('start-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionText = document.getElementById('question-text');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    
    const scoreCirclePath = document.getElementById('score-circle-path');
    const scoreText = document.getElementById('score-text');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    
    const leadForm = document.getElementById('lead-form');
    
    // Lista de perguntas
    const questions = [
        { text: "Sua empresa coleta dados como CPF, telefone ou e-mail?", secureAnswer: "no" },
        { text: "Você possui política de privacidade no site?", secureAnswer: "yes" },
        { text: "Seus dados são armazenados de forma segura?", secureAnswer: "yes" },
        { text: "Você realiza backup regularmente?", secureAnswer: "yes" },
        { text: "Seus funcionários usam acesso individual (login/senha)?", secureAnswer: "yes" },
        { text: "Existe controle de quem acessa os dados?", secureAnswer: "yes" },
        { text: "Sua empresa já sofreu tentativa de invasão?", secureAnswer: "no" },
        { text: "Você utiliza antivírus ou firewall?", secureAnswer: "yes" },
        { text: "Seus sistemas são atualizados regularmente?", secureAnswer: "yes" },
        { text: "Você sabe o que fazer em caso de vazamento de dados?", secureAnswer: "yes" }
    ];
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    // Iniciar Diagnóstico
    startBtn.addEventListener('click', () => {
        heroSection.style.display = 'none';
        quizSection.style.display = 'block';
        loadQuestion();
    });
    
    function loadQuestion() {
        const q = questions[currentQuestionIndex];
        questionText.textContent = q.text;
        
        // Atualizar barra de progresso
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    function handleAnswer(answer) {
        const q = questions[currentQuestionIndex];
        if (answer === q.secureAnswer) {
            score += 10;
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }
    
    btnYes.addEventListener('click', () => handleAnswer('yes'));
    btnNo.addEventListener('click', () => handleAnswer('no'));
    
    function showResult() {
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        // Animação do score (Circular Chart)
        // O valor máximo de stroke-dasharray para um círculo completo é ~100
        setTimeout(() => {
            scoreCirclePath.setAttribute('stroke-dasharray', `${score}, 100`);
            scoreText.textContent = `${score}/100`;
            
            // Lógica de cores baseada no score
            if (score <= 30) {
                scoreCirclePath.setAttribute('stroke', '#ef4444'); // Red
                resultTitle.textContent = "Alto Risco";
                resultTitle.style.color = "#ef4444";
                resultDesc.textContent = "Sua empresa apresenta falhas críticas de segurança e pode estar vulnerável a multas e ataques.";
            } else if (score <= 70) {
                scoreCirclePath.setAttribute('stroke', '#eab308'); // Yellow
                resultTitle.textContent = "Médio Risco";
                resultTitle.style.color = "#eab308";
                resultDesc.textContent = "Existem pontos de melhoria que podem colocar seus dados em risco.";
            } else {
                scoreCirclePath.setAttribute('stroke', '#10b981'); // Green
                resultTitle.textContent = "Seguro";
                resultTitle.style.color = "#10b981";
                resultDesc.textContent = "Sua empresa está no caminho certo, mas ainda pode melhorar.";
            }
        }, 100);
    }
    
    // Captura de Lead e Envio pro WhatsApp
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('lead-name').value;
        const company = document.getElementById('lead-company').value;
        
        const message = `Olá, fiz o diagnóstico no site e quero saber mais sobre a segurança da minha empresa. Meu resultado foi: ${score}/100. Nome: ${name} (${company})`;
        const whatsappUrl = `https://wa.me/5592996092339?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });
});