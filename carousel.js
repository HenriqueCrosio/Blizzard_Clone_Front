document.addEventListener('DOMContentLoaded', function() {
    // --------------------------------
    // 1) MENU RESPONSIVO
    // --------------------------------
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // --------------------------------
    // 2) CARROSSEL
    // --------------------------------
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;

    // Clonar o primeiro e o último slide para criar o efeito cíclico
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    container.appendChild(firstClone);
    container.insertBefore(lastClone, slides[0]);

    function updateCarousel(transition = true) {
        const slideWidth = slides[0].offsetWidth;
        const slideMargin = parseFloat(getComputedStyle(slides[0]).marginRight);
        const offset = -(currentSlide + 1) * (slideWidth + slideMargin * 2);

        container.style.transition = transition ? 'transform 0.5s ease' : 'none';
        container.style.transform = `translateX(${offset}px)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        if (currentSlide >= slides.length - 1) {
            currentSlide = -1;
            updateCarousel(false);
        }
        currentSlide++;
        updateCarousel();
    }

    function prevSlide() {
        if (currentSlide <= 0) {
            currentSlide = slides.length;
            updateCarousel(false);
        }
        currentSlide--;
        updateCarousel();
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    container.addEventListener('transitionend', () => {
        if (currentSlide >= slides.length) {
            currentSlide = 0;
            updateCarousel(false);
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
            updateCarousel(false);
        }
    });

    window.addEventListener('resize', () => updateCarousel(false));
    updateCarousel(false);

    // --------------------------------
    // 3) FILTRO DOS CARDS DE JOGOS
    // --------------------------------
    const gameCards = document.querySelectorAll('.game-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            gameCards.forEach(card => {
                const categories = card.getAttribute('data-categories').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --------------------------------
    // 4) VÍDEOS NOS CARDS
    // --------------------------------
    gameCards.forEach(card => {
        const video = card.querySelector('video');
        if (video) {
            video.addEventListener('loadeddata', () => {
                console.log('Vídeo carregado com sucesso:', video.src);
            });

            video.addEventListener('error', (e) => {
                console.error('Erro ao carregar o vídeo:', video.src, e);
            });

            card.addEventListener('mouseenter', () => {
                video.style.opacity = '1';
                video.play().catch(error => {
                    console.log("Autoplay foi impedido:", error);
                    // Botão de play (caso queira tratar manualmente)
                    const playButton = document.createElement('button');
                    playButton.textContent = 'Play';
                    playButton.style.position = 'absolute';
                    playButton.style.top = '50%';
                    playButton.style.left = '50%';
                    playButton.style.transform = 'translate(-50%, -50%)';
                    playButton.style.zIndex = '10';
                    card.querySelector('.card-media').appendChild(playButton);
                    playButton.addEventListener('click', () => {
                        video.play();
                        playButton.remove();
                    });
                });
            });

            card.addEventListener('mouseleave', () => {
                video.style.opacity = '0';
                video.pause();
                video.currentTime = 0;
                const playButton = card.querySelector('button');
                if (playButton) playButton.remove();
            });
        }
    });
});
