
class ContactController {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
                message: 'Nome deve conter pelo menos 2 caracteres e apenas letras'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email deve ter um formato válido'
            },
            phone: {
                required: true,
                pattern: /^[\d\s()\-+]+$/,
                minLength: 10,
                message: 'Telefone deve ter pelo menos 10 dígitos'
            },
            subject: {
                required: true,
                message: 'Por favor, selecione um assunto'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Mensagem deve ter pelo menos 10 caracteres'
            }
        };
        
        this.init();
    }

    init() {
        this.setupForm();
        this.setupRealTimeValidation();
        this.setupFormMask();
        this.setupAutoComplete();
        this.setupFormSubmission();
        this.setupWhatsAppIntegration();
    }

    setupForm() {
        this.form = document.getElementById('contact-form');
        
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        this.setupFloatingLabels();
    }

    setupFloatingLabels() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                this.updateLabelState(input, label);
                
                input.addEventListener('focus', () => {
                    label.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    label.classList.remove('focused');
                    this.updateLabelState(input, label);
                });
                
                input.addEventListener('input', () => {
                    this.updateLabelState(input, label);
                });
            }
        });
    }

    updateLabelState(input, label) {
        if (input.value.trim() !== '' || input.type === 'date') {
            label.classList.add('filled');
        } else {
            label.classList.remove('filled');
        }
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                this.updateSubmitButton();
            });
            
            if (input.tagName.toLowerCase() === 'select') {
                input.addEventListener('change', () => {
                    this.validateField(input);
                });
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        this.clearFieldError(field);
        
        if (rules.required && !value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }
        
        if (value) {
            if (rules.minLength && value.length < rules.minLength) {
                this.showFieldError(field, rules.message);
                return false;
            }
            
            if (rules.pattern && !rules.pattern.test(value)) {
                this.showFieldError(field, rules.message);
                return false;
            }
        }
        
        if (fieldName === 'email' && value) {
            return this.validateEmail(field, value);
        } else if (fieldName === 'phone' && value) {
            return this.validatePhone(field, value);
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    validateEmail(field, email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFieldError(field, 'Email deve ter um formato válido (ex: nome@email.com)');
            return false;
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    validatePhone(field, phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.length < 10) {
            this.showFieldError(field, 'Telefone deve ter pelo menos 10 dígitos');
            return false;
        }
        
        if (cleanPhone.length > 11) {
            this.showFieldError(field, 'Telefone deve ter no máximo 11 dígitos');
            return false;
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #FF6B6B;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
            animation: fadeInUp 0.3s ease;
        `;
        
        field.style.borderColor = '#FF6B6B';
        field.style.boxShadow = '0 0 0 2px rgba(255, 107, 107, 0.2)';
    }

    showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '#51CF66';
        field.style.boxShadow = '0 0 0 2px rgba(81, 207, 102, 0.2)';
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error', 'success');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    setupFormMask() {
        const phoneInput = this.form.querySelector('#phone');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
                        value = value.replace(/^(\d{2})(\d{0,4})$/, '($1) $2');
                        value = value.replace(/^(\d{0,2})$/, '($1');
                    } else {
                        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                        value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
                        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
                    }
                }
                
                e.target.value = value;
            });
        }
    }

    setupAutoComplete() {
        const nameInput = this.form.querySelector('#name');
        const emailInput = this.form.querySelector('#email');
        
        if (nameInput) {
            nameInput.setAttribute('autocomplete', 'name');
        }
        
        if (emailInput) {
            emailInput.setAttribute('autocomplete', 'email');
        }
    }

    setupFormSubmission() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            this.submitButton = submitButton;
            this.originalButtonText = submitButton.innerHTML;
        }
    }

    handleFormSubmission() {
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        
        if (!isValid) {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        this.setSubmitLoading(true);
        
        const formData = this.getFormData();
        
        this.submitForm(formData);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }

    submitForm(data) {
        setTimeout(() => {
            this.handleSubmissionSuccess(data);
        }, 2000);
    }

    handleSubmissionSuccess(data) {
        this.setSubmitLoading(false);
        this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        this.resetForm();
        
        this.trackFormSubmission(data);
    }

    handleSubmissionError(error) {
        this.setSubmitLoading(false);
        this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        console.error('Form submission error:', error);
    }

    setSubmitLoading(loading) {
        this.isSubmitting = loading;
        
        if (this.submitButton) {
            if (loading) {
                this.submitButton.disabled = true;
                this.submitButton.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Enviando...
                `;
            } else {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = this.originalButtonText;
            }
        }
    }

    updateSubmitButton() {
        if (!this.submitButton) return;
        
        const isFormValid = this.validateForm();
        this.submitButton.disabled = !isFormValid || this.isSubmitting;
    }

    resetForm() {
        this.form.reset();
        
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            
            const input = group.querySelector('input, select, textarea');
            if (input) {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
            
            const label = group.querySelector('label');
            if (label) {
                label.classList.remove('filled', 'focused');
            }
        });
    }

    setupWhatsAppIntegration() {
        const whatsappButton = document.querySelector('.whatsapp-float a');
        
        if (whatsappButton) {
            whatsappButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        }
    }

    openWhatsApp(customMessage = '') {
        const phone = '5581986766673';
        const message = customMessage || 'Olá! Gostaria de saber mais informações sobre a Escola Tia Carla.';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon;
        if (type === 'success') {
            icon = 'check-circle';
        } else if (type === 'error') {
            icon = 'exclamation-triangle';
        } else {
            icon = 'info-circle';
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        let backgroundColor;
        if (type === 'success') {
            backgroundColor = '#51CF66';
        } else if (type === 'error') {
            backgroundColor = '#FF6B6B';
        } else {
            backgroundColor = '#4ECDC4';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-family: 'Poppins', sans-serif;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    trackFormSubmission(data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': data.subject,
                'value': 1
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }
    }

    setupAccessibility() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.setAttribute('aria-labelledby', label.id || 'label-' + input.name);
                input.setAttribute('aria-describedby', 'help-' + input.name);
            }
        });
        
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'textarea') {
                e.preventDefault();
                this.focusNextField(e.target);
            }
        });
    }

    focusNextField(currentField) {
        const fields = Array.from(this.form.querySelectorAll('input, select, textarea, button'));
        const currentIndex = fields.indexOf(currentField);
        const nextField = fields[currentIndex + 1];
        
        if (nextField) {
            nextField.focus();
        }
    }
}

class ContactMap {
    constructor() {
        this.initializeMap();
    }

    initializeMap() {
        console.log('Map integration placeholder');
    }
}

let contactController;
let contactMap;

document.addEventListener('DOMContentLoaded', () => {
    contactController = new ContactController();
    contactMap = new ContactMap();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContactController,
        ContactMap
    };
}
