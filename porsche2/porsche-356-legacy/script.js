document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0');
            }
        });
    }, observerOptions);

    // Observe elements with animations
    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(function(el) {
        el.classList.add('opacity-0');
        observer.observe(el);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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

    // Remove parallax effect to keep car image centered
    // window.addEventListener('scroll', function() {
    //     const scrolled = window.pageYOffset;
    //     const rate = scrolled * -0.5;
    //     const carImage = document.querySelector('#hero img');

    //     if (carImage && scrolled < window.innerHeight) {
    //         carImage.style.transform = `translateX(-50%) translateY(${rate * 0.1}px)`;
    //     }
    // });

    // Add loading animation to images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        // If image is already loaded (cached)
        if (img.complete) {
            img.classList.add('loaded');
        }
    });





    // Add typing animation to hero title
    const heroTitle = document.querySelector('#hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        // Start typing animation after page load
        setTimeout(typeWriter, 300);
    }

    // Add scroll-triggered animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });



    // Add fade-in animation for sections
    const sections = document.querySelectorAll('section');
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const fadeInOnScroll = new IntersectionObserver(function(entries, fadeInOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                fadeInOnScroll.unobserve(entry.target);
            }
        });
    }, fadeInOptions);

    sections.forEach(section => {
        fadeInOnScroll.observe(section);
    });

    // Mobile menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const closeMenu = document.getElementById('close-menu');

    if (menuToggle && mobileMenu && mobileMenuPanel && closeMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Trigger animation after a small delay
            setTimeout(function() {
                mobileMenuPanel.classList.remove('translate-x-full');
            }, 10);
        });

        function closeMenuWithAnimation() {
            mobileMenuPanel.classList.add('translate-x-full');
            
            setTimeout(function() {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 300);
        }

        closeMenu.addEventListener('click', closeMenuWithAnimation);

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMenuWithAnimation();
            }
        });

        // Close menu when clicking on navigation links
        const mobileNavLinks = mobileMenu.querySelectorAll('a[href^="#"]');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenuWithAnimation();
            });
        });
    }

    // Function to scroll to iconic section
    window.scrollToIconic = function() {
        const iconicSection = document.getElementById('iconic');
        if (iconicSection) {
            iconicSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
});
