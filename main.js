import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const reveals = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  // Accordion Logic
  const acc = document.getElementsByClassName("accordion");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }

  // Floating CTA Scroll Logic
  const heroSection = document.getElementById('hero');
  const floatingCta = document.querySelector('.floating-cta');
  
  if (heroSection && floatingCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show CTA when we scroll PAST the hero section
        if (!entry.isIntersecting) {
          floatingCta.classList.add('visible');
        } else {
          floatingCta.classList.remove('visible');
        }
      });
    }, { threshold: 0.2 });
    ctaObserver.observe(heroSection);
  }

  // Smooth scroll for chevron
  const scrollDowns = document.querySelectorAll('.scroll-down');
  scrollDowns.forEach(sd => {
    sd.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });
  });

  // Particle System Logic
  initParticles();
});

function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particlesArray;

  function setSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setSize();
  window.addEventListener('resize', setSize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // Slightly larger for glitter
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * -1 - 0.2; // delicate floating upwards 
      
      this.opacity = Math.random() * 0.5 + 0.2;
      this.twinkleDir = Math.random() > 0.5 ? 0.02 : -0.02;
      
      // Mix of Gold and Bright White glitter
      this.colorBase = Math.random() > 0.4 ? '255, 215, 0' : '255, 255, 255'; 
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Twinkle effect (pulsing opacity)
      this.opacity += this.twinkleDir;
      if (this.opacity >= 0.9) this.twinkleDir = -0.015;
      if (this.opacity <= 0.1) this.twinkleDir = 0.015;

      // Wrap around to the bottom when reaching the top
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
    }
    draw() {
      ctx.fillStyle = `rgba(${this.colorBase}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    // Cap particles so it is subtle and doesn't hurt performance
    if (numberOfParticles > 100) numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  createParticles();
  animateParticles();
}
