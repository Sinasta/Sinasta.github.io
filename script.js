const CONFIG = {
  IMAGE_PATH: 'images/',
  IMAGE_FORMAT: 'webp',

  PROJECT_DATA: {
    25: { title: "Griesplatz - Graz", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "90%", prize: null },
    24: { title: "Griesplatz - Graz", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "65%", prize: null },
    23: { title: "LAGA - Sachsen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/11-saechsische-landesgartenschau-in-auerbachvogtl-und-rodewisch-freudenthal-2029-579379/prizegroup/1-preis-198597.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/landesgartenschau-sachsen", focusY: "70%", prize: 1 },
    22: { title: "LAGA - Sachsen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/11-saechsische-landesgartenschau-in-auerbachvogtl-und-rodewisch-freudenthal-2029-579379/prizegroup/1-preis-198597.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/landesgartenschau-sachsen", focusY: "70%", prize: 1 },
    21: { title: "Mathildenhöhe - Darmstadt", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-freiflaechen-am-informationszentrum-mathildenhoehe-in-darmstadt-634364/prizegroup/ein-1-preis-217143.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "85%", prize: 1 },
    20: { title: "Mathildenhöhe - Darmstadt", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-freiflaechen-am-informationszentrum-mathildenhoehe-in-darmstadt-634364/prizegroup/ein-1-preis-217143.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "70%", prize: 1 },
    19: { title: "Horb am Neckar", titleLink: "https://www.competitionline.com/de/news/ergebnisse/rueckbau-ortsdurchfahrt-und-neugestaltung-innenstadt-horb-am-neckar-562061/prizegroup/1-preis-zuschlag-192412.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/horb-am-neckar", focusY: "50%", prize: 1 },
    18: { title: "Alice-Salomon-Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "80%", prize: null },
    17: { title: "Ernst-Abbe-Platz - Jena", titleLink: "https://www.competitionline.com/de/news/ergebnisse/klimaangepasste-platzgestaltung-ernst-abbe-platz-in-jena-592546/prizegroup/2-preis-202426.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/ernst-abbe-platz", focusY: "70%", prize: 2 },
    16: { title: "Ernst-Abbe-Platz - Jena", titleLink: "https://www.competitionline.com/de/news/ergebnisse/klimaangepasste-platzgestaltung-ernst-abbe-platz-in-jena-592546/prizegroup/2-preis-202426.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/ernst-abbe-platz", focusY: "55%", prize: 2 },
    15: { title: "Stahlwerkspark - Oberhausen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/gestaltung-stahlwerkspark-in-oberhausen-572729/prizegroup/anerkennung-193706.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/stahlwerkspark-oberhausen", focusY: "55%", prize: "recognition" },
    14: { title: "Stahlwerkspark - Oberhausen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/gestaltung-stahlwerkspark-in-oberhausen-572729/prizegroup/anerkennung-193706.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/stahlwerkspark-oberhausen", focusY: "70%", prize: "recognition" },
    13: { title: "Wilhelm-Leuschner-Platz - Leipzig", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/leipzig-leuschner", focusY: "20%", prize: null },
    12: { title: "Wilhelm-Leuschner-Platz - Leipzig", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/leipzig-leuschner", focusY: "50%", prize: null },
    11: { title: "Altmarkt - Duisburg", titleLink: "https://www.competitionline.com/de/news/ergebnisse/umgestaltung-altmarkt-alt-hamborn-in-duisburg-557619/prizegroup/3-preis-190478.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/alt-hamborn", focusY: "50%", prize: 3 },
    10: { title: "Marktplatz - Vilseck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-marktplatz-vilseck-520308/prizegroup/anerkennung-176405.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/vilseck", focusY: "80%", prize: "recognition" },
    9: { title: "Marktplatz - Vilseck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-marktplatz-vilseck-520308/prizegroup/anerkennung-176405.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/vilseck", focusY: "95%", prize: "recognition" },
    8: { title: "Inklusives Quartier - Reutlingen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/quartiersentwicklung-konradsiedlung-in-regensburg-546558/prizegroup/3-preis-192170.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/rappertshofen", focusY: "70%", prize: 3 },
    7: { title: "Inklusives Quartier - Reutlingen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/quartiersentwicklung-konradsiedlung-in-regensburg-546558/prizegroup/3-preis-192170.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/rappertshofen", focusY: "70%", prize: 3 },
    6: { title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "50%", prize: 2 },
    5: { title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "40%", prize: 2 },
    4: { title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "50%", prize: 2 },
    3: { title: "Lausitzer Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/berlin", focusY: "80%", prize: null },
    2: { title: "Lausitzer Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/berlin", focusY: "55%", prize: null },
    1: { title: "Moisling - Lübeck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neubau-stadtteilhaus-moisling-in-luebeck-585323/prizegroup/3-preis-200457.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "50%", prize: 3 }
  },
  
  DESKTOP_DURATION: 12000,
  MOBILE_PAN_DURATION: 12000,
  PRELOAD_COUNT: 2
};

class ImageViewer {
  constructor() {
    this.container = document.getElementById('imageContainer');
    this.loader = document.getElementById('loader');
    this.projectInfoEl = document.getElementById('projectInfo');
    this.uiBar = document.getElementById('uiBar');
    this.images = [];
    this.currentIndex = 0;
    this.slideTimeout = null;
    this.isInteracting = false;
    this.modalOverlay = document.getElementById('modalOverlay');
    this.aboutTrigger = document.getElementById('aboutTrigger');
    this.modalClose = document.getElementById('modalClose');
    this.contactForm = document.getElementById('contactForm');
    this.toastContainer = document.getElementById('toastContainer');
    this.lastFocusedElement = null;
    
    this.init();
  }
  
  init() {
    const keys = Object.keys(CONFIG.PROJECT_DATA).map(Number).sort((a, b) => b - a);
    
    keys.forEach(id => {
      const data = CONFIG.PROJECT_DATA[id];
      this.images.push({
        id: id,
        src: `${CONFIG.IMAGE_PATH}${id}.${CONFIG.IMAGE_FORMAT}`,
        title: data.title || "",
        titleLink: data.titleLink || null,
        office: data.office || "",
        officeLink: data.officeLink || null,
        focusY: data.focusY || null,
        prize: data.prize || null
      });
    });

    document.documentElement.style.setProperty('--pan-duration', `${CONFIG.MOBILE_PAN_DURATION}ms`);

    this.preloadImages().then(() => {
      this.createSlides();
      this.setupInteractionListeners();
      this.setupModalListeners();
      this.setupScrollIndicator();
      this.showSlide(0);
      this.hideLoader();
      this.scheduleNextSlide();
    });
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
      if (Math.abs(e.deltaY) > 10) {
        this.isInteracting = true;
        if (e.deltaY > 0) this.nextSlide();
        else this.prevSlide();
        this.resetSchedule();
        setTimeout(() => { this.isInteracting = false; }, 300);
      }
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      this.pausePanAnimation();
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
      }
      this.resumePanAnimation();
    }, { passive: true });

    window.addEventListener('touchcancel', () => {
      this.resumePanAnimation();
    }, { passive: true });
  }

  pausePanAnimation() {
    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.add('pan-paused');
  }

  resumePanAnimation() {
    const activeImg = this.container.querySelector('.image-slide.active img');
    if (activeImg) activeImg.classList.remove('pan-paused');
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
          this.showToast('success', 'Message sent!');
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

    // Remove the toast after animation completes (5s)
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }

  openModal() {
    this.modalOverlay.classList.add('active');
    this.modalOverlay.hidden = false;
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
    
    this.currentIndex = index;
    
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
    for (let i = 1; i <= CONFIG.PRELOAD_COUNT; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < this.images.length) {
        const img = new Image();
        img.src = this.images[nextIndex].src;
      }
    }
  }
  
  scheduleNextSlide() {
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
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showSlide(prevIndex);
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