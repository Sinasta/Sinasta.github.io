import { CONFIG, PROJECTS } from './config.js';

class ImageViewer {
  constructor() {
    this.container = document.getElementById('imageContainer');
    this.splatContainer = document.getElementById('splatContainer');
    this.loader = document.getElementById('loader');
    this.projectInfoEl = document.getElementById('projectInfo');
    this.uiBar = document.getElementById('uiBar');
    this.images = [];
    this.currentIndex = 0;
    this.slideTimeout = null;
    this.isInteracting = false;
    this.isHolding = false;
    this.modalOverlay = document.getElementById('modalOverlay');
    this.aboutTrigger = document.getElementById('aboutTrigger');
    this.modalClose = document.getElementById('modalClose');
    this.contactForm = document.getElementById('contactForm');
    this.toastContainer = document.getElementById('toastContainer');
    this.toggle3D = document.getElementById('toggle3D');
    this.lastFocusedElement = null;

    this.is3DMode = false;
    this.splatViewer = null;
    
    this.scrollAccumulated = 0;
    this.scrollTimeout = null;
    
    this.init();
  }
  
  async init() {
    const sortedProjects = [...PROJECTS].sort((a, b) => b.id - a.id);
    
    sortedProjects.forEach(project => {
      this.images.push({
        id: project.id,
        src: `${CONFIG.IMAGE_PATH}${project.id}.${CONFIG.IMAGE_FORMAT}`,
        title: project.title || "",
        titleLink: project.titleLink || null,
        office: project.office || "",
        officeLink: project.officeLink || null,
        focusY: project.focusY || "50%",
        prize: project.prize || null
      });
    });

    document.documentElement.style.setProperty('--pan-duration', `${CONFIG.MOBILE_PAN_DURATION}ms`);

    await this.preloadImages();
    this.createSlides();
    this.setupInteractionListeners();
    this.setupModalListeners();
    this.setupToggle3D();
    this.setupScrollIndicator();
    this.showSlide(0);
    this.hideLoader();
    this.scheduleNextSlide();
  }
  
  preloadImages() {
    const promises = [];
    const toLoad = this.images.slice(0, Math.min(CONFIG.PRELOAD_COUNT + 1, this.images.length));
    toLoad.forEach(img => {
      promises.push(new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = img.src;
      }));
    });
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
    return Promise.all([...promises, minLoadTime]);
  }
  
  createSlides() {
    this.images.forEach((img, index) => {
      const slide = document.createElement('div');
      slide.className = 'image-slide';
      slide.dataset.index = index;
      
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.title ? `${img.title} – architectural visualization by ${img.office}`.trim() : `Architecture visualization ${img.id}`;
      image.loading = index < 3 ? 'eager' : 'lazy';

      if (img.focusY) {
        image.style.objectPosition = `center ${img.focusY}`;
      }
      
      slide.appendChild(image);
      this.container.appendChild(slide);
    });
    
    this.slides = this.container.querySelectorAll('.image-slide');
  }

  setupInteractionListeners() {
    window.addEventListener('wheel', (e) => {
      if (this.isInteracting || this.modalOverlay.classList.contains('active')) return;
      
      this.scrollAccumulated += e.deltaY;
      
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => { this.scrollAccumulated = 0; }, 150);
      
      if (Math.abs(this.scrollAccumulated) > 80) {
        this.isInteracting = true;
        if (this.scrollAccumulated > 0) this.nextSlide();
        else this.prevSlide();
        this.resetSchedule();
        this.scrollAccumulated = 0;
        setTimeout(() => { this.isInteracting = false; }, 100);
      }
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      this.pausePanAnimation();
      this.isHolding = true;
      if (this.slideTimeout) clearTimeout(this.slideTimeout);
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.isInteracting || this.modalOverlay.classList.contains('active')) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        this.isInteracting = true;
        if (diff > 0) this.nextSlide();
        else this.prevSlide();
        this.resetSchedule();
        setTimeout(() => { this.isInteracting = false; }, 300);
      } else {
        this.scheduleNextSlide();
      }
      
      this.resumePanAnimation();
      this.isHolding = false;
    }, { passive: true });

    window.addEventListener('touchcancel', () => {
      this.resumePanAnimation();
      if (this.isHolding) {
        this.isHolding = false;
        this.scheduleNextSlide();
      }
    }, { passive: true });
  }

  pausePanAnimation() {
    if (this.is3DMode) return;
    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.add('pan-paused');
  }

  resumePanAnimation() {
    if (this.is3DMode) return;
    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.remove('pan-paused');
  }

  exit3DAndShowSlide(targetIndex) {
    const splatLoader = document.getElementById('splatLoader');
    if (splatLoader) splatLoader.hidden = true;
    
    this.currentIndex = targetIndex;
    
    this.slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      if (img) {
        img.style.animation = 'none';
        void img.offsetHeight;
        img.style.animation = '';
      }
      slide.classList.toggle('active', i === targetIndex);
    });
    
    this.updateInfoBox(this.images[targetIndex]);
    this.preloadAhead(targetIndex);
    
    this.splatContainer.style.transition = 'opacity 0.3s ease';
    this.container.style.transition = 'opacity 0.3s ease';
    this.splatContainer.style.opacity = '0';
    this.container.style.opacity = '1';
    
    this.is3DMode = false;
    this.toggle3D.classList.remove('active');
    this.toggle3D.setAttribute('aria-pressed', 'false');
    
    setTimeout(() => {
      this.splatContainer.hidden = true;
      this.splatContainer.style.zIndex = '';
      this.splatContainer.style.opacity = '';
      this.splatContainer.style.transition = '';
      this.container.style.transition = '';
      
      if (this.splatViewer) {
        this.splatViewer.dispose();
        this.splatViewer = null;
      }
    }, 600);
    
    this.scheduleNextSlide();
  }

  setupToggle3D() {
    if (!this.toggle3D) return;
    
    if (window.innerWidth < 769) {
        this.toggle3D.style.display = 'none';
    }

    this.toggle3D.addEventListener('click', async () => {
      if (window.innerWidth < 769) return;

      const isActive = this.toggle3D.classList.toggle('active');
      this.toggle3D.setAttribute('aria-pressed', isActive);
      this.is3DMode = isActive;
      const splatLoader = document.getElementById('splatLoader');

      if (isActive) {
        splatLoader.hidden = false;
        
        this.splatContainer.hidden = false;
        this.splatContainer.style.opacity = '0';
        this.splatContainer.style.transition = 'opacity 0.3s ease';
        this.splatContainer.style.zIndex = '10';
        
        if (!this.splatViewer) {
          const { SplatViewer } = await import('./splat.js');
          this.splatViewer = new SplatViewer(this.splatContainer);
          await this.splatViewer.init();
        }
        
        const currentImg = this.images[this.currentIndex];
        
        // Pass focusY to apply the same vertical shift as the 2D image
        this.splatViewer.loadSplat(currentImg.id, currentImg.focusY, () => {
          splatLoader.hidden = true;
          this.container.style.transition = 'opacity 0.3s ease';
          this.container.style.opacity = '0';
          this.splatContainer.style.opacity = '1';
        });
        
        if (this.slideTimeout) clearTimeout(this.slideTimeout);
      } else {
        splatLoader.hidden = true;
        this.splatContainer.style.opacity = '0';
        this.container.style.opacity = '1';
        
        setTimeout(() => {
          this.splatContainer.hidden = true;
          this.splatContainer.style.zIndex = '';
          this.splatContainer.style.opacity = '';
          this.splatContainer.style.transition = '';
          this.container.style.transition = '';
          
          if (this.splatViewer) {
            this.splatViewer.dispose();
            this.splatViewer = null;
          }
        }, 600);
        
        this.scheduleNextSlide();
      }
    });
  }

  setupModalListeners() {
    this.aboutTrigger.addEventListener('click', () => {
      this.openModal();
    });

    this.modalClose.addEventListener('click', () => {
      this.closeModal();
    });

    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
        this.closeModal();
      }
    });

    this.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      
      try {
        const formData = new FormData(this.contactForm);
        const response = await fetch(this.contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          this.showToast('success', 'Message sent! I\'ll get back to you soon.');
          this.contactForm.reset();
          this.closeModal();
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.errors?.[0]?.message || 'Submission failed');
        }
      } catch (error) {
        this.showToast('error', `Failed to send. Please try again.`);
        console.error('Form submission error:', error);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }
    
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }

  openModal() {
    this.modalOverlay.classList.add('active');
    this.modalOverlay.hidden = false;
    this.modalOverlay.style.display = '';
    document.body.style.overflow = 'hidden';
    this.lastFocusedElement = document.activeElement;
    
    requestAnimationFrame(() => {
      this.modalClose.focus();
    });
  }

  closeModal() {
    this.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }
  
  showSlide(index) {
    if (index < 0 || index >= this.images.length) return;

    this.currentIndex = index;

    if (this.is3DMode && this.splatViewer) {
      const currentImg = this.images[index];
      // Pass focusY to maintain the same vertical alignment when switching projects in 3D mode
      this.splatViewer.loadSplat(currentImg.id, currentImg.focusY);
    } else {
      this.slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
          img.style.animation = 'none';
          void img.offsetHeight;
          img.style.animation = '';
        }
      });
      
      this.slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
    
    const currentData = this.images[index];
    this.updateInfoBox(currentData);
    
    if (index === 0) {
      setTimeout(() => { this.uiBar.classList.add('visible'); }, 500);
    }
    
    this.preloadAhead(index);
  }

  updateInfoBox(data) {
    this.projectInfoEl.innerHTML = '';
    
    const titleEl = document.createElement('span');
    titleEl.className = 'info-title';
    if (data.titleLink) {
      const link = document.createElement('a');
      link.href = data.titleLink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = data.title;
      titleEl.appendChild(link);
    } else {
      titleEl.textContent = data.title;
    }
    this.projectInfoEl.appendChild(titleEl);

    if (data.office || data.prize) {
      const metaEl = document.createElement('span');
      metaEl.className = 'info-office';
      
      if (data.prize) {
        const prizeEl = document.createElement('span');
        prizeEl.className = 'info-prize';
        if (data.prize === 'recognition') {
          prizeEl.textContent = 'Recognition';
        } else {
          prizeEl.textContent = `${data.prize}. Prize`;
        }
        metaEl.appendChild(prizeEl);
      }
      
      if (data.office) {
        if (data.officeLink) {
          const link = document.createElement('a');
          link.href = data.officeLink;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = data.office;
          metaEl.appendChild(link);
        } else {
          const text = document.createElement('span');
          text.textContent = data.office;
          metaEl.appendChild(text);
        }
      }
      
      this.projectInfoEl.appendChild(metaEl);
    }
  }
  
  preloadAhead(currentIndex) {
    if (this.is3DMode) return;
    
    for (let i = 1; i <= CONFIG.PRELOAD_COUNT; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < this.images.length) {
        const img = new Image();
        img.src = this.images[nextIndex].src;
      }
    }
  }
  
  scheduleNextSlide() {
    if (this.is3DMode) return;

    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? CONFIG.MOBILE_PAN_DURATION : CONFIG.DESKTOP_DURATION;
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    
    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, delay);
  }

  resetSchedule() {
    this.scheduleNextSlide();
  }
  
  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    if (this.is3DMode) {
      this.exit3DAndShowSlide(nextIndex);
    } else {
      this.showSlide(nextIndex);
    }
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    if (this.is3DMode) {
      this.exit3DAndShowSlide(prevIndex);
    } else {
      this.showSlide(prevIndex);
    }
  }
  
  hideLoader() { 
    this.loader.classList.add('hidden'); 
    setTimeout(() => {
      if (this.loader && this.loader.parentNode) {
        this.loader.parentNode.removeChild(this.loader);
      }
    }, 600);
  }

  setupScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;
    
    const hideIndicator = () => {
      indicator.classList.add('hidden');
      window.removeEventListener('wheel', hideIndicator);
      window.removeEventListener('touchstart', hideIndicator);
      window.removeEventListener('keydown', hideIndicator);
    };
    
    window.addEventListener('wheel', hideIndicator, { passive: true });
    window.addEventListener('touchstart', hideIndicator, { passive: true });
    window.addEventListener('keydown', hideIndicator);
    
    setTimeout(hideIndicator, 30000);
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  window.viewer = new ImageViewer(); 
});

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'c', 'p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});