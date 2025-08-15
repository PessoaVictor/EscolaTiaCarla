
document.addEventListener('DOMContentLoaded', function() {
    
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeModals();
    initializeFloatingElements();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeSelectBehavior();
    initializeCounters();
    
});

function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
        
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
        
        markImagesAsLoaded();
        
    }, 4500);
}

function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateActiveNavigation();
    });
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initializeScrollEffects() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        revealOnScroll();
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

function initializeAnimations() {
    const floatingElements = document.querySelectorAll('.floating-icon');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    const staggerElements = document.querySelectorAll('.activity-card, .program-card, .testimonial-card');
    
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    addHoverEffects();
}

function addHoverEffects() {
    const cards = document.querySelectorAll('.program-card, .activity-card, .testimonial-card, .feature, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
}

function initializeModals() {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    let currentImageIndex = 0;
    
    galleryItems.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            currentImageIndex = index;
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modalPrev.addEventListener('click', () => {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryItems.length - 1;
        modalImage.src = galleryItems[currentImageIndex].src;
        modalImage.alt = galleryItems[currentImageIndex].alt;
    });
    
    modalNext.addEventListener('click', () => {
        currentImageIndex = currentImageIndex < galleryItems.length - 1 ? currentImageIndex + 1 : 0;
        modalImage.src = galleryItems[currentImageIndex].src;
        modalImage.alt = galleryItems[currentImageIndex].alt;
    });
    
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                modalPrev.click();
            } else if (e.key === 'ArrowRight') {
                modalNext.click();
            }
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initializeFloatingElements() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach(shape => {
            shape.style.transform = `translateY(${rate}px)`;
        });
    });
    
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        const duration = 3000 + (index * 500);
        
        setInterval(() => {
            icon.style.transform = `translateY(-10px)`;
            setTimeout(() => {
                icon.style.transform = `translateY(0px)`;
            }, duration / 2);
        }, duration);
    });
}

function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (validateForm(name, email, phone, subject, message)) {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                this.reset();
                
            }
        });
        
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
}

function validateForm(name, email, phone, subject, message) {
    let isValid = true;
    
    if (!name || name.length < 2) {
        showError('name', 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('email', 'Email inválido');
        isValid = false;
    }
    
    const phoneRegex = /^[\d\s()+-]+$/;
    if (!phone || !phoneRegex.test(phone) || phone.length < 10) {
        showError('phone', 'Telefone inválido');
        isValid = false;
    }
    
    if (!subject) {
        showError('subject', 'Selecione um assunto');
        isValid = false;
    }
    
    if (!message || message.length < 10) {
        showError('message', 'Mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearError(field);
    
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showError(fieldName, 'Nome deve ter pelo menos 2 caracteres');
                return false;
            }
            break;
            
        case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                showError(fieldName, 'Email inválido');
                return false;
            }
            break;
        }
        case 'phone': {
            const phoneRegex = /^[\d\s()+-]+$/;
            if (!value || !phoneRegex.test(value) || value.length < 10) {
                showError(fieldName, 'Telefone inválido');
                return false;
            }
            break;
        }
            
        case 'subject':
            if (!value) {
                showError(fieldName, 'Selecione um assunto');
                return false;
            }
            break;
            
        case 'message':
            if (!value || value.length < 10) {
                showError(fieldName, 'Mensagem deve ter pelo menos 10 caracteres');
                return false;
            }
            break;
    }
    
    return true;
}

function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    clearError(field);
    
    formGroup.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
    
    field.style.borderColor = '#FF6B6B';
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    formGroup.classList.remove('error');
    field.style.borderColor = '';
}

function getIconForNotificationType(type) {
    if (type === 'success') return 'check-circle';
    if (type === 'error') return 'exclamation-circle';
    return 'info-circle';
}

function getNotificationColor(type) {
    if (type === 'success') return '#51CF66';
    if (type === 'error') return '#FF6B6B';
    return '#4ECDC4';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getIconForNotificationType(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}


function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Poppins', sans-serif;
    }
    
    .error-message {
        color: #FF6B6B;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        position: absolute;
        bottom: -20px;
        left: 0;
    }
    
    .form-group {
        position: relative;
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #FF6B6B !important;
    }
`;

document.head.appendChild(rippleStyle);

function initializeSelectBehavior() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
        function updateLabel() {
            const label = select.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (select.value && select.value !== '') {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        }
        
        updateLabel();
        
        select.addEventListener('change', updateLabel);
        select.addEventListener('focus', updateLabel);
        select.addEventListener('blur', updateLabel);
    });
}

function markImagesAsLoaded() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.setAttribute('loaded', 'true');
        } else {
            img.addEventListener('load', function() {
                this.setAttribute('loaded', 'true');
            });
            img.addEventListener('error', function() {
                this.removeAttribute('loaded');
            });
        }
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('.counter-number[data-count]');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        
        const timer = setInterval(() => {
            current++;
            counter.textContent = current;
            
            if (current >= target) {
                clearInterval(timer);
            }
        }, 150);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const counter = entry.target;
            
            if (entry.isIntersecting) {
                counter.textContent = '0';
                setTimeout(() => animateCounter(counter), 300);
            } else {
                counter.textContent = '0';
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });
    
    counters.forEach(counter => {
        counter.textContent = '0';
        observer.observe(counter);
    });
}
