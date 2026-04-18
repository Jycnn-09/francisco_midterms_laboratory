const typewriterText = document.getElementById('typewriterText');
const schoolTrack = document.getElementById('schoolTrack');
const schoolPrev = document.getElementById('schoolPrev');
const schoolNext = document.getElementById('schoolNext');
const schoolCards = [...document.querySelectorAll('.school-card')];
const schoolViewport = document.querySelector('.school-carousel-viewport');
const schoolStory = document.getElementById('schoolStory');
const schoolStoriesList = [...document.querySelectorAll('.school-story[data-school]')];

const message = 'Welcome. I\'m glad you\'re here.';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const schoolStories = {
  elementary: {
    title: 'Elementary school',
    text: 'Elementary school was where I first learned how exciting it could be to discover new things. It gave me early memories of friendship, curiosity, and the simple joy of learning step by step. It was the stage where small achievements felt big, where every lesson added a little more confidence, and where the people around me helped shape the way I began to see growth, effort, and belonging.',
    image: 'images/elem.jpg',
    alt: 'Elementary school memory'
  },
  'junior-high': {
    title: 'Junior high school',
    text: 'Junior high was a chapter of change and growth. It taught me how to adjust, build confidence, and understand myself a little more through each new challenge and experience. It was a time of discovering new strengths, handling unfamiliar situations, and learning how much progress can come from showing up even when things feel uncertain at first.',
    image: 'images/juniorhigh.jpg',
    alt: 'Junior high school memory'
  },
  'senior-high': {
    title: 'Senior high school',
    text: 'Senior high felt like preparation for a bigger future. It was a meaningful season of effort, reflection, and memories that helped shape the direction I want to keep following. More than anything, it made me think seriously about the person I wanted to become, the goals I wanted to chase, and the value of carrying both lessons and memories with me into whatever comes next.',
    image: 'images/seniorhigh.jpg',
    alt: 'Senior high school memory'
  }
};

if (typewriterText) {
  if (reducedMotion) {
    typewriterText.textContent = message;
  } else {
    let index = 0;

    const writeNextCharacter = () => {
      typewriterText.textContent = message.slice(0, index);
      index += 1;

      if (index <= message.length) {
        const currentCharacter = message[index - 1];
        const delay = currentCharacter === '.' || currentCharacter === ',' ? 130 : 55;
        window.setTimeout(writeNextCharacter, delay);
      }
    };

    writeNextCharacter();
  }
}

if (schoolTrack && schoolCards.length) {
  let currentIndex = 0;
  let autoSlideId = null;

  const updateCarouselPosition = () => {
    const cardWidth = schoolCards[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(schoolTrack).gap) || 0;
    schoolTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
  };

  const clampIndex = (index) => {
    const maxIndex = Math.max(0, schoolCards.length - 1);
    return Math.min(Math.max(index, 0), maxIndex);
  };

  const setActiveCard = (card) => {
    schoolCards.forEach(item => item.classList.toggle('is-active', item === card));

    const activeStory = schoolStoriesList.find(story => story.dataset.school === card.dataset.school);
    schoolStoriesList.forEach(story => story.classList.toggle('is-active', story === activeStory));

    if (activeStory) {
      activeStory.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  const setCarouselIndex = (index) => {
    currentIndex = clampIndex(index);
    schoolCards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === currentIndex);
    });
    updateCarouselPosition();
  };

  const startAutoSlide = () => {
    if (reducedMotion) return;
    window.clearInterval(autoSlideId);
    autoSlideId = window.setInterval(() => {
      currentIndex = currentIndex >= schoolCards.length - 1 ? 0 : currentIndex + 1;
      setCarouselIndex(currentIndex);
    }, 2600);
  };

  const stopAutoSlide = () => {
    window.clearInterval(autoSlideId);
  };

  schoolPrev?.addEventListener('click', () => {
    stopAutoSlide();
    setCarouselIndex(currentIndex <= 0 ? schoolCards.length - 1 : currentIndex - 1);
    startAutoSlide();
  });

  schoolNext?.addEventListener('click', () => {
    stopAutoSlide();
    setCarouselIndex(currentIndex >= schoolCards.length - 1 ? 0 : currentIndex + 1);
    startAutoSlide();
  });

  schoolCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      setActiveCard(card);
      setCarouselIndex(index);
      startAutoSlide();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveCard(card);
        setCarouselIndex(index);
        startAutoSlide();
      }
    });
  });

  schoolViewport?.addEventListener('mouseenter', stopAutoSlide);
  schoolViewport?.addEventListener('mouseleave', startAutoSlide);
  schoolTrack.addEventListener('mouseenter', stopAutoSlide);
  schoolTrack.addEventListener('mouseleave', startAutoSlide);

  window.addEventListener('resize', () => {
    setCarouselIndex(currentIndex);
  });

  setCarouselIndex(0);
  startAutoSlide();
}

// Modal functionality
const modal = document.getElementById('project-modal');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.querySelector('.modal-close');

const openModal = (message) => {
  modalMessage.textContent = message;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};

modalClose?.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Project modal trigger
const projectModalCard = document.querySelector('.project-card-modal');
projectModalCard?.addEventListener('click', () => {
  openModal('This project has been personally submitted to my professor and I don\'t have the copy for myself.');
});
