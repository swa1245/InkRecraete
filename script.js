document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.image-conatiner');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function slideImages(direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from current image
        imageContainers[currentIndex].classList.remove('active');
        imageContainers[currentIndex].classList.add('prev');
        
        // Update index based on direction
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % imageContainers.length;
        } else {
            currentIndex = (currentIndex - 1 + imageContainers.length) % imageContainers.length;
        }
        
        // Remove prev class from new current image
        imageContainers[currentIndex].classList.remove('prev');
        // Add active class to next image
        imageContainers[currentIndex].classList.add('active');

        // Update indicators
        updateIndicators();

        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 700); // Match this with CSS transition duration
    }

    // Initialize first image and indicators
    imageContainers[0].classList.add('active');
    updateIndicators();
    
    // Start the slideshow with 3 second delay
    let slideInterval = setInterval(() => slideImages('next'), 3000);

    // Add touch events for mobile swipe
    document.getElementById('center').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(slideInterval); // Pause auto-slide on touch
    }, false);

    document.getElementById('center').addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent page scroll
    }, false);

    document.getElementById('center').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        slideInterval = setInterval(() => slideImages('next'), 3000); // Resume auto-slide
    }, false);

    // Handle swipe direction
    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                slideImages('prev'); // Swipe right, go to previous
            } else {
                slideImages('next'); // Swipe left, go to next
            }
        }
    }

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (currentIndex === index || isAnimating) return;
            clearInterval(slideInterval);
            
            const direction = index > currentIndex ? 'next' : 'prev';
            slideImages(direction);
            
            slideInterval = setInterval(() => slideImages('next'), 3000);
        });
    });

    // Add mouse parallax effect
    const center = document.getElementById('center');
    center.addEventListener('mousemove', (e) => {
        const rect = center.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width - 0.5) * 20;
        const yPercent = (y / rect.height - 0.5) * 20;
        
        const active = document.querySelector('.image-conatiner.active');
        if (active) {
            active.style.transform = `scale(1.02) translate3d(${xPercent}px, ${yPercent}px, 0)`;
        }
    });

    // Reset transform on mouse leave
    center.addEventListener('mouseleave', () => {
        const active = document.querySelector('.image-conatiner.active');
        if (active) {
            active.style.transform = 'scale(1) translate3d(0, 0, 0)';
        }
    });

    // Marquee Animation
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        let scrollPos = 0;
        const speed = 0.3; // Keeping slow speed for smooth movement
        let animationFrameId = null;
        let isPaused = false;
        const content = marqueeTrack.querySelector('.marquee-content');
        const totalWidth = content.offsetWidth;

        // Pre-calculate reset point to avoid glitches
        const resetPoint = totalWidth;

        function updateMarquee() {
            if (!isPaused) {
                scrollPos -= speed;
                
                // Smooth reset when reaching the end
                if (Math.abs(scrollPos) >= resetPoint) {
                    scrollPos = 0;
                }
                
                // Use transform3d for smoother animation
                marqueeTrack.style.transform = `translate3d(${scrollPos}px, 0, 0)`;
            }
            animationFrameId = requestAnimationFrame(updateMarquee);
        }

        // Pause on hover
        const marqueeContainer = document.querySelector('.marquee-container');
        if (marqueeContainer) {
            marqueeContainer.addEventListener('mouseenter', () => {
                isPaused = true;
            });

            marqueeContainer.addEventListener('mouseleave', () => {
                isPaused = false;
            });

            // Handle visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    cancelAnimationFrame(animationFrameId);
                } else {
                    animationFrameId = requestAnimationFrame(updateMarquee);
                }
            });

            // Start animation
            updateMarquee();
        }
    }
});
