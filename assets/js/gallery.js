
class GalleryController {
    constructor() {
        this.currentFilter = 'all';
        this.galleryItems = [];
        this.modal = null;
        this.currentImageIndex = 0;
        this.isModalOpen = false;
        
        this.init();
    }

    init() {
        this.setupGalleryElements();
        this.setupFilterButtons();
        this.setupModal();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.initializeMasonry();
    }

    setupGalleryElements() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        
        this.galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            
            if (img) {
                img.loading = 'lazy';
                img.addEventListener('load', () => {
                    item.classList.add('loaded');
                });
                
                img.addEventListener('error', () => {
                    img.src = 'assets/images/placeholder.jpg';
                    item.classList.add('error');
                });
            }
            
            item.addEventListener('click', () => {
                this.openModal(index);
            });
            
            this.setupHoverEffects(item);
        });
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterGallery(filter);
                this.updateActiveButton(button);
            });
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;
        
        this.galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                this.showItem(item, index);
            } else {
                this.hideItem(item);
            }
        });
        
        setTimeout(() => {
            this.updateMasonryLayout();
        }, 300);
    }

    showItem(item, index) {
        item.style.display = 'block';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, index * 50);
    }

    hideItem(item) {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            item.style.display = 'none';
        }, 300);
    }

    updateActiveButton(activeButton) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    setupModal() {
        this.modal = document.getElementById('gallery-modal');
        const modalClose = document.querySelector('.modal-close');
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        
        modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        modalPrev.addEventListener('click', () => this.previousImage());
        modalNext.addEventListener('click', () => this.nextImage());
        
        this.setupModalTouchEvents();
    }

    openModal(index) {
        const visibleItems = this.getVisibleItems();
        this.currentImageIndex = visibleItems.findIndex(item => 
            this.galleryItems.indexOf(item) === index
        );
        
        if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
        }
        
        this.updateModalImage();
        this.modal.classList.add('active');
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.transition = 'opacity 0.3s ease';
            this.modal.style.opacity = '1';
        }, 10);
    }

    closeModal() {
        this.modal.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            this.isModalOpen = false;
            document.body.style.overflow = 'auto';
            this.modal.style.transition = '';
        }, 300);
    }

    nextImage() {
        const visibleItems = this.getVisibleItems();
        this.currentImageIndex = (this.currentImageIndex + 1) % visibleItems.length;
        this.updateModalImage();
    }

    previousImage() {
        const visibleItems = this.getVisibleItems();
        this.currentImageIndex = this.currentImageIndex > 0 ? 
            this.currentImageIndex - 1 : visibleItems.length - 1;
        this.updateModalImage();
    }

    updateModalImage() {
        const visibleItems = this.getVisibleItems();
        const currentItem = visibleItems[this.currentImageIndex];
        const modalImage = document.getElementById('modal-image');
        
        if (currentItem && modalImage) {
            const img = currentItem.querySelector('img');
            
            modalImage.style.opacity = '0';
            modalImage.style.transform = 'scale(0.9)';
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            
            modalImage.onload = () => {
                modalImage.style.transition = 'all 0.3s ease';
                modalImage.style.opacity = '1';
                modalImage.style.transform = 'scale(1)';
            };
            
            this.updateNavigationButtons(visibleItems.length);
        }
    }

    updateNavigationButtons(totalImages) {
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        
        if (totalImages <= 1) {
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
        } else {
            modalPrev.style.display = 'block';
            modalNext.style.display = 'block';
        }
    }

    getVisibleItems() {
        return this.galleryItems.filter(item => {
            const category = item.dataset.category;
            return this.currentFilter === 'all' || category === this.currentFilter;
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case ' ':
                    e.preventDefault();
                    this.nextImage();
                    break;
            }
        });
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.modal.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.modal.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    setupModalTouchEvents() {
        const modalImage = document.getElementById('modal-image');
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        modalImage.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            modalImage.style.transition = 'none';
        });
        
        modalImage.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            modalImage.style.transform = `translateX(${diffX}px)`;
        });
        
        modalImage.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            const diffX = currentX - startX;
            const threshold = 50;
            
            modalImage.style.transition = 'transform 0.3s ease';
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            } else {
                modalImage.style.transform = 'translateX(0)';
            }
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.previousImage();
            } else {
                this.nextImage();
            }
        }
        
        if (Math.abs(diffY) > Math.abs(diffX) && diffY > threshold) {
            this.closeModal();
        }
    }

    setupHoverEffects(item) {
        const overlay = item.querySelector('.gallery-overlay');
        const img = item.querySelector('img');
        
        item.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.3s ease';
            
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transition = 'opacity 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    }

    initializeMasonry() {
        this.updateMasonryLayout();
        
        window.addEventListener('resize', () => {
            this.updateMasonryLayout();
        });
    }

    updateMasonryLayout() {
        const container = document.getElementById('gallery-grid');
        const items = container.querySelectorAll('.gallery-item[style*="block"], .gallery-item:not([style])');
        
        items.forEach(item => {
            item.style.transform = '';
        });
        
        const containerWidth = container.offsetWidth;
        const itemWidth = 300;
        const gap = 20;
        const columns = Math.floor(containerWidth / (itemWidth + gap));
        
        if (columns > 1) {
            container.style.columnCount = columns;
            container.style.columnGap = gap + 'px';
        }
    }

    setupLazyLoading() {
        const images = this.galleryItems.map(item => item.querySelector('img'));
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.gallery-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.searchGallery(searchTerm);
            });
        }
    }

    searchGallery(searchTerm) {
        this.galleryItems.forEach(item => {
            const img = item.querySelector('img');
            const alt = img.alt.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            
            const matches = alt.includes(searchTerm) || category.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                this.showItem(item, 0);
            } else {
                this.hideItem(item);
            }
        });
    }

    startSlideshow(interval = 3000) {
        this.slideshowInterval = setInterval(() => {
            this.nextImage();
        }, interval);
    }

    stopSlideshow() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
    }

    toggleFullscreen() {
        const modalContent = document.querySelector('.modal-content');
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            modalContent.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        }
    }

    downloadImage() {
        const modalImage = document.getElementById('modal-image');
        const link = document.createElement('a');
        link.download = 'espacotiacarla-image.jpg';
        link.href = modalImage.src;
        link.click();
    }

    shareImage() {
        if (navigator.share) {
            navigator.share({
                title: 'Escola Tia Carla',
                text: 'Confira essa foto da Escola Tia Carla!',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('Link copiado para a área de transferência!');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'gallery-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    destroy() {
        this.stopSlideshow();
    }
}

class GalleryFilters {
    constructor() {
        this.activeFilter = 'all';
        this.setupFilters();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.animateFilterChange(button);
            });
        });
    }

    animateFilterChange(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

let galleryController;
let galleryFilters;

document.addEventListener('DOMContentLoaded', () => {
    galleryController = new GalleryController();
    galleryFilters = new GalleryFilters();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GalleryController,
        GalleryFilters
    };
}
