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

    // Video Cards Interaction
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        // Add hover effect for thumbnails
        const thumbnail = card.querySelector('.video-thumbnail');
        const playButton = card.querySelector('.play-button');
        
        if (thumbnail && playButton) {
            // Smooth entrance animation for play button
            card.addEventListener('mouseenter', () => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
                setTimeout(() => {
                    playButton.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 200);
            });

            // Click handler for video cards
            card.addEventListener('click', () => {
                // Here you would typically open a modal or redirect to the video page
                console.log('Video clicked:', card.querySelector('h3').textContent);
                // Example modal trigger (you would need to implement the modal)
                // openVideoModal(card.dataset.videoId);
            });
        }
    });

    // Counter Animation for Global Impact Section
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.closest('.impact-stat-item').dataset.count);
            let current = 0;
            const increment = target / 50; // Adjust speed of counting
            const duration = 2000; // 2 seconds
            const step = duration / 50;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, step);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        hasAnimated = true;
    }

    // Intersection Observer for triggering animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const impactStats = document.querySelector('.impact-stats');
    if (impactStats) {
        observer.observe(impactStats);
    }

    // Loading Animation
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced Search
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchResults = document.querySelector('.search-results');

    // Sample product data (replace with your actual products)
    const products = [
        { name: 'Premium Black Ink', category: 'Printing Ink' },
        { name: 'UV-Resistant Ink', category: 'Specialty Ink' },
        { name: 'Eco-Solvent Ink', category: 'Eco-Friendly' },
        { name: 'Textile Printing Ink', category: 'Fabric Ink' },
        { name: 'Digital Printing Ink', category: 'Digital Solutions' }
    ];

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length > 0) {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query)
            );
            
            displaySearchResults(filteredProducts);
            searchDropdown.classList.add('active');
        } else {
            searchDropdown.classList.remove('active');
        }
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = results.length > 0 
            ? results.map(product => `
                <div class="search-result-item">
                    <h4>${product.name}</h4>
                    <span class="category">${product.category}</span>
                </div>
            `).join('')
            : '<div class="no-results">No products found</div>';
    }

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchDropdown.classList.remove('active');
        }
    });

    // Contact Form Animations
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add animation class when input is focused
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        // Remove animation class when input is blurred
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Add animation class if input has value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Form submission animation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            // Show success message
            const formMessage = document.createElement('div');
            formMessage.className = 'form-message success';
            formMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your message! We'll get back to you soon.</p>
            `;
            form.appendChild(formMessage);
            
            // Reset form
            form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                formMessage.remove();
            }, 5000);
        }, 2000);
    });
    
    // Parallax effect for office cards
    const offices = document.querySelectorAll('.office');
    
    offices.forEach(office => {
        office.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = office.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * 10;
            
            office.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        });
        
        office.addEventListener('mouseleave', () => {
            office.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Social icons hover effect
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('i').style.animation = 'bounce 0.5s ease infinite';
        });
        
        item.addEventListener('mouseleave', () => {
            item.querySelector('i').style.animation = 'none';
        });
    });
});
