
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupClickAnimations();
        this.setupCounterAnimations();
        this.setupTypewriterAnimations();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, this.observerOptions);

        const animatedElements = document.querySelectorAll([
            '[data-animate]',
            '.animate-on-scroll',
            '.counter',
            '.progress-bar',
            '.typewriter'
        ].join(', '));

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    triggerAnimation(element) {
        const animationType = element.dataset.animate || element.className;
        
        if (element.classList.contains('counter')) {
            this.animateCounter(element);
        } else if (element.classList.contains('progress-bar')) {
            this.animateProgressBar(element);
        } else if (element.classList.contains('typewriter')) {
            this.animateTypewriter(element);
        } else {
            this.applyScrollAnimation(element, animationType);
        }
    }

    setupScrollAnimations() {
        const revealElements = document.querySelectorAll([
            '.section-title',
            '.section-subtitle',
            '.feature',
            '.program-card',
            '.activity-card',
            '.testimonial-card',
            '.contact-item'
        ].join(', '));

        revealElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    applyScrollAnimation(element, animationType) {
        element.classList.add('animated');
        
        if (animationType.includes('fadeInUp') || !animationType.includes('animate')) {
            element.classList.add('animate-fadeInUp');
        } else if (animationType.includes('fadeInLeft')) {
            element.classList.add('animate-fadeInLeft');
        } else if (animationType.includes('fadeInRight')) {
            element.classList.add('animate-fadeInRight');
        } else if (animationType.includes('scaleIn')) {
            element.classList.add('animate-scaleIn');
        } else if (animationType.includes('bounceIn')) {
            element.classList.add('animate-bounceIn');
        }
    }

    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll([
            '.btn',
            '.nav-link',
            '.social-links a',
            '.gallery-item',
            '.filter-btn'
        ].join(', '));

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverEffect(element);
            });

            element.addEventListener('mouseleave', () => {
                this.removeHoverEffect(element);
            });
        });

        const cards = document.querySelectorAll([
            '.program-card',
            '.activity-card',
            '.testimonial-card',
            '.feature'
        ].join(', '));

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    addHoverEffect(element) {
        if (element.classList.contains('btn')) {
            element.style.transform = 'translateY(-2px) scale(1.05)';
            element.style.transition = 'all 0.3s ease';
        } else if (element.classList.contains('nav-link')) {
            element.style.color = 'var(--primary-color)';
            element.style.transform = 'translateY(-2px)';
        } else if (element.classList.contains('gallery-item')) {
            element.style.transform = 'scale(1.05)';
            element.style.transition = 'transform 0.3s ease';
        }
    }

    removeHoverEffect(element) {
        if (element.classList.contains('btn')) {
            element.style.transform = '';
        } else if (element.classList.contains('nav-link')) {
            element.style.color = '';
            element.style.transform = '';
        } else if (element.classList.contains('gallery-item')) {
            element.style.transform = '';
        }
    }

    setupClickAnimations() {
        const clickableElements = document.querySelectorAll([
            '.btn',
            '.filter-btn',
            '.nav-link',
            '.gallery-item'
        ].join(', '));

        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e, element);
                this.addClickAnimation(element);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addClickAnimation(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            element.style.transform = '';
        }, 100);
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter, .stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent) || 0;
            counter.dataset.target = target;
            counter.textContent = '0';
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                if (element.textContent.includes('+')) {
                    element.textContent = target + '+';
                }
            }
        };

        updateCounter();
    }

    animateProgressBar(element) {
        const progress = element.dataset.progress || '100';
        const progressFill = element.querySelector('.progress-fill');
        
        if (progressFill) {
            progressFill.style.width = '0%';
            progressFill.style.transition = 'width 2s ease-out';
            
            setTimeout(() => {
                progressFill.style.width = progress + '%';
            }, 100);
        }
    }

    setupTypewriterAnimations() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.dataset.text = text;
            element.textContent = '';
        });
    }

    animateTypewriter(element) {
        const text = element.dataset.text;
        const speed = parseInt(element.dataset.speed) || 100;
        let i = 0;

        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                element.style.borderRight = '2px solid var(--primary-color)';
                element.style.animation = 'blinkCursor 1s infinite';
            }
        };

        typeChar();
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax, .hero-shapes, .shape');
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }

    startFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.floating-icon, .shape');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 500;
            const duration = 3000 + (index * 500);
            
            setInterval(() => {
                element.style.animation = `floatSlow ${duration}ms ease-in-out infinite`;
            }, delay);
        });
    }

    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    chainAnimations(element, animations, delays = []) {
        let currentIndex = 0;
        
        const runNextAnimation = () => {
            if (currentIndex < animations.length) {
                const animation = animations[currentIndex];
                const delay = delays[currentIndex] || 0;
                
                setTimeout(() => {
                    element.classList.add(animation);
                    currentIndex++;
                    runNextAnimation();
                }, delay);
            }
        };
        
        runNextAnimation();
    }

    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    fadeOut(element, duration = 500) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    slideIn(element, direction = 'left', duration = 500) {
        let translateValue;
        if (direction === 'left') {
            translateValue = '-100%';
        } else if (direction === 'right') {
            translateValue = '100%';
        } else if (direction === 'up') {
            translateValue = '-100%';
        } else {
            translateValue = '100%';
        }
        
        const property = (direction === 'left' || direction === 'right') ? 'translateX' : 'translateY';
        
        element.style.transform = `${property}(${translateValue})`;
        element.style.transition = `transform ${duration}ms ease`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transform = `${property}(0)`;
        }, 10);
    }

    bounce(element, intensity = 10, duration = 600) {
        element.style.animation = `bounce ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    shake(element, intensity = 10, duration = 600) {
        element.style.animation = `shake ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    glow(element, color = 'var(--primary-color)', duration = 2000) {
        element.style.boxShadow = `0 0 20px ${color}`;
        element.style.transition = `box-shadow ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, duration);
    }

    throttle(func, limit) {
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

    destroy() {
        this.animations.clear();
    }
}


class LoadingAnimations {
    static showSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner-ring"></div>';
        container.appendChild(spinner);
        return spinner;
    }

    static hideSpinner(spinner) {
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => {
                if (spinner.parentNode) {
                    spinner.parentNode.removeChild(spinner);
                }
            }, 300);
        }
    }

    static showProgress(container, progress) {
        let progressBar = container.querySelector('.progress-bar');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = '<div class="progress-fill"></div>';
            container.appendChild(progressBar);
        }
        
        const fill = progressBar.querySelector('.progress-fill');
        fill.style.width = progress + '%';
    }
}

class PageTransitions {
    static fadeTransition(duration = 500) {
        document.body.style.opacity = '0';
        document.body.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    static slideTransition(direction = 'left', duration = 500) {
        const main = document.querySelector('main') || document.body;
        const translateValue = direction === 'left' ? '-100%' : '100%';
        
        main.style.transform = `translateX(${translateValue})`;
        main.style.transition = `transform ${duration}ms ease`;
        
        setTimeout(() => {
            main.style.transform = 'translateX(0)';
        }, 100);
    }
}

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            count: options.count || 50,
            color: options.color || '#FF6B9D',
            size: options.size || 2,
            speed: options.speed || 1,
            ...options
        };
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${this.options.size}px;
                height: ${this.options.size}px;
                background: ${this.options.color};
                border-radius: 50%;
                pointer-events: none;
            `;
            
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed
            });
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.container.offsetHeight) {
                particle.vy *= -1;
            }

            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
}

let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
    
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroParticles = new ParticleSystem(hero, {
            count: 30,
            color: 'rgba(255, 107, 157, 0.1)',
            size: 3,
            speed: 0.5
        });
        animationController.heroParticles = heroParticles;
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationController,
        LoadingAnimations,
        PageTransitions,
        ParticleSystem
    };
}
