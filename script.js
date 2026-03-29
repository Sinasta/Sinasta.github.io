import { CONFIG, PROJECTS } from './config.js';

class ImageViewer {
  constructor() {
    this.container = document.getElementById('imageContainer');
    this.splatContainer = document.getElementById('splatContainer');
    this.videoContainer = null;
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
    this.isVideoMode = false;
    this.splatViewer = null;
    this.currentVideo = null;
    this.videoWasPlaying = false;
    
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
        videoSrc: `${CONFIG.VIDEO_PATH}${project.id}.${CONFIG.VIDEO_FORMAT}`,
        title: project.title || "",
        titleLink: project.titleLink || null,
        office: project.office || "",
        officeLink: project.officeLink || null,
        focusY: project.focusY || "50%",
        prize: project.prize || null
      });
    });

    document.documentElement.style.setProperty('--pan-duration', `${CONFIG.MOBILE_PAN_DURATION}ms`);

    this.createVideoContainer();

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

  createVideoContainer() {
    this.videoContainer = document.createElement('div');
    this.videoContainer.id = 'videoContainer';
    this.videoContainer.className = 'video-container';
    this.videoContainer.hidden = true;
    document.body.appendChild(this.videoContainer);
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
      
      image.addEventListener('animationend', (e) => {
        if (e.animationName === 'panRight' && 
            slide.classList.contains('active') && 
            !this.isInteracting && 
            !this.isVideoMode && 
            !this.is3DMode) {
          this.nextSlide();
        }
      });
      
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
        setTimeout(() => { this.isInteracting = false; }, 300);
      }
      
      this.resumePanAnimation();
      this.isHolding = false;
    }, { passive: true });

    window.addEventListener('touchcancel', () => {
      this.resumePanAnimation();
      if (this.isHolding) {
        this.isHolding = false;
      }
    }, { passive: true });
  }

  pausePanAnimation() {
    if (this.is3DMode) return;

    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.add('pan-paused');

    if (this.isVideoMode && this.videoContainer) {
      this.videoContainer.classList.add('paused');
      if (this.currentVideo && !this.currentVideo.paused) {
        this.currentVideo.pause();
        this.videoWasPlaying = true;
      }
    }
  }

  resumePanAnimation() {
    if (this.is3DMode) return;

    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.remove('pan-paused');

    if (this.isVideoMode && this.videoContainer) {
      this.videoContainer.classList.remove('paused');
      if (this.currentVideo && this.videoWasPlaying) {
        this.currentVideo.play().catch(() => {});
        this.videoWasPlaying = false;
      }
    }
  }

  isMobile() {
    return window.innerWidth < 769 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  getCurrentPanProgress() {
    if (!this.isMobile()) return 0;
    
    let element;
    if (this.isVideoMode && this.currentVideo) {
      element = this.currentVideo;
    } else {
      const activeSlide = this.container.querySelector('.image-slide.active');
      element = activeSlide ? activeSlide.querySelector('img') : null;
    }
    
    if (!element) return 0;
    
    try {
      const computedStyle = window.getComputedStyle(element);
      const objectPos = computedStyle.objectPosition;
      
      let percent;
      if (objectPos.includes('left')) {
        percent = 0;
      } else if (objectPos.includes('right')) {
        percent = 100;
      } else if (objectPos.includes('center')) {
        percent = 50;
      } else {
        const match = objectPos.match(/([\d.]+)%/);
        if (match) {
          percent = parseFloat(match[1]);
        } else {
          percent = 50;
        }
      }
      
      return percent / 100;
    } catch (e) {
      console.warn('Could not read pan position:', e);
      return 0;
    }
  }

  async loadVideo(index, startProgress = 0) {
    const videoData = this.images[index];
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo.remove();
      this.currentVideo = null;
    }

    const playbackRate = CONFIG.VIDEO_DURATION / CONFIG.MOBILE_PAN_DURATION;
    const duration = CONFIG.MOBILE_PAN_DURATION;

    const video = document.createElement('video');
    video.src = videoData.videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.playbackRate = playbackRate;
    video.style.width = '100%';
    video.style.height = '100%';
    
    if (startProgress > 0) {
      const delaySeconds = -(startProgress * (duration / 1000));
      video.style.animationDelay = `${delaySeconds}s`;
    }

    video.addEventListener('animationend', (e) => {
      if (e.animationName === 'videoPanRight' && 
          this.isVideoMode && 
          this.currentVideo === video && 
          !this.isInteracting) {
        this.nextSlide();
      }
    });

    await new Promise((resolve, reject) => {
      video.onloadeddata = resolve;
      video.onerror = reject;
      setTimeout(resolve, 3000);
    });

    this.videoContainer.innerHTML = '';
    this.videoContainer.appendChild(video);
    this.currentVideo = video;

    try {
      await video.play();
    } catch (e) {
      console.warn('Video autoplay failed:', e);
    }
  }

  async enterVideoMode() {
    const progress = this.getCurrentPanProgress();
    
    this.isVideoMode = true;
    this.videoContainer.hidden = false;
    this.container.style.opacity = '0';
    await this.loadVideo(this.currentIndex, progress);

    this.videoContainer.style.opacity = '1';
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
  }

  exitVideoMode() {
    const progress = this.getCurrentPanProgress();
    
    this.isVideoMode = false;
    
    this.videoContainer.style.opacity = '0';
    this.container.style.opacity = '1';
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo.remove();
      this.currentVideo = null;
    }

    setTimeout(() => {
      this.videoContainer.hidden = true;
    }, 300);

    if (progress >= 0.99) {
      this.nextSlide();
    } else {
      this.showSlide(this.currentIndex, progress);
    }
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
    
    this.toggle3D.style.display = 'flex';

    let isTransitioning = false;

    this.toggle3D.addEventListener('click', async () => {
      if (isTransitioning) return;
      isTransitioning = true;

      const isActive = !this.toggle3D.classList.contains('active');
      this.toggle3D.classList.toggle('active', isActive);
      this.toggle3D.setAttribute('aria-pressed', isActive);
      
      const splatLoader = document.getElementById('splatLoader');
      
      if (isActive) {
        if (this.isMobile()) {
          await this.enterVideoMode();
          isTransitioning = false;
          return;
        }
        
        splatLoader.hidden = false;
        
        this.splatContainer.hidden = false;
        this.splatContainer.style.opacity = '0';
        this.splatContainer.style.zIndex = '10';
        
        try {
          if (!this.splatViewer) {
            const { SplatViewer } = await import('./splat.js');
            this.splatViewer = new SplatViewer(this.splatContainer);
            await this.splatViewer.init();
            
            if (!this.splatViewer.renderer || !this.splatViewer.renderer.getContext()) {
              throw new Error('WebGL context failed to initialize');
            }
          }
          
          const currentImg = this.images[this.currentIndex];
          
          const loadPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Splat load timeout'));
            }, 10000);
            
            this.splatViewer.loadSplat(currentImg.id, currentImg.focusY, () => {
              clearTimeout(timeout);
              resolve();
            });
          });
          
          await loadPromise;
          
          requestAnimationFrame(() => {
            this.container.style.transition = 'opacity 0.3s ease';
            this.container.style.opacity = '0';
            this.splatContainer.style.opacity = '1';
            splatLoader.hidden = true;
          });
          
          this.is3DMode = true;
          if (this.slideTimeout) clearTimeout(this.slideTimeout);
          
        } catch (error) {
          console.error('3D mode failed:', error);
          this.showToast('error', '3D view unavailable. Please try again.');
          this.exit3DAndShowSlide(this.currentIndex);
        }
      } else {
        splatLoader.hidden = true;
        
        if (this.isVideoMode) {
          this.exitVideoMode();
        } else if (this.is3DMode) {
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
            this.is3DMode = false;
            this.scheduleNextSlide();
          }, 600);
        }
      }
      
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
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
  
  showSlide(index, startProgress = 0) {
    if (index < 0 || index >= this.images.length) return;
    
    if (startProgress >= 0.99) {
      this.nextSlide();
      return;
    }

    this.currentIndex = index;

    if (this.isVideoMode) {
      this.loadVideo(index, startProgress);
      this.updateInfoBox(this.images[index]);
      return;
    }

    if (this.is3DMode && this.splatViewer) {
      const currentImg = this.images[index];
      this.splatViewer.loadSplat(currentImg.id, currentImg.focusY);
    } else {
      this.slides.forEach((slide, i) => {
        const img = slide.querySelector('img');
        if (img) {
          img.style.animation = '';
          img.style.animationDelay = '';
          void img.offsetHeight;
          
          if (i === index && startProgress > 0 && this.isMobile()) {
            const duration = CONFIG.MOBILE_PAN_DURATION;
            const delaySeconds = -(startProgress * (duration / 1000));
            img.style.animation = `panRight ${duration}ms linear forwards`;
            img.style.animationDelay = `${delaySeconds}s`;
            img.style.animationPlayState = 'running';
          }
        }
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
    if (this.is3DMode || this.isVideoMode) return;
    
    for (let i = 1; i <= CONFIG.PRELOAD_COUNT; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < this.images.length) {
        const img = new Image();
        img.src = this.images[nextIndex].src;
      }
    }
  }
  
  scheduleNextSlide() {
    if (this.is3DMode || this.isMobile()) return;

    const delay = CONFIG.DESKTOP_DURATION;

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