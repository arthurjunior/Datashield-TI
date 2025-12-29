/**
 * CONTATO PAGE - FORM HANDLING
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send to a backend
            // For now, we'll create a WhatsApp link or show success message
            
            // Create WhatsApp message
            const message = `Olá, meu nome é ${data.name}.\n\nEmpresa: ${data.company || 'N/A'}\nE-mail: ${data.email}\nTelefone: ${data.phone}\n\nAssunto: ${data.subject}\n\nMensagem:\n${data.message}`;
            const whatsappUrl = `https://wa.me/5592996092339?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp or show success
            window.open(whatsappUrl, '_blank');
            
            // Optional: Show success message
            const submitButton = form.querySelector('.form-submit');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Enviado com Sucesso!</span>';
            submitButton.style.background = 'linear-gradient(135deg, #00ff88, #00ff88)';
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = '';
                form.reset();
            }, 3000);
        });
    }
});

