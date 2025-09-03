// Optimized JavaScript bundle for better performance
(function() {
    'use strict';

    // Performance monitoring
    const perfMarks = {};

    function mark(name) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
        perfMarks[name] = Date.now();
    }

    function measure(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            try {
                window.performance.measure(name, startMark, endMark);
            } catch (e) {
                // Measure already exists
            }
        }
    }

    mark('js-start');

    // Throttle function for performance
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Optimized DOM ready function
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Optimized preloader with resource hints
    ready(function() {
        mark('dom-ready');
        const preloader = document.querySelector('.preloader');
        const splineBackground = document.getElementById('spline-background');
        const body = document.body;

        // Показываем 3D-модель сразу при готовности DOM
        if (splineBackground) {
            splineBackground.style.display = 'block';
        }

        // Critical resources to preload
        const criticalResources = [
            'css/style.css',
            'css/parallax.css',
            'css/scroll-animations.css'
        ];

        let loadedResources = 0;
        const totalResources = criticalResources.length;

        // Preload critical resources
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });

        function showContent() {
            if (preloader) {
                preloader.classList.add('loaded');
                body.style.overflow = 'hidden';

                setTimeout(() => {
                    body.style.overflow = '';
                    initializeAnimations();
                }, 300);
            }
        }

        // Show content after a minimum time for better UX
        const minLoadTime = 1500;
        const startTime = Date.now();

        function checkLoadComplete() {
            const elapsed = Date.now() - startTime;
            if (elapsed >= minLoadTime) {
                showContent();
            } else {
                setTimeout(checkLoadComplete, minLoadTime - elapsed);
            }
        }

        checkLoadComplete();
        mark('preloader-complete');
    });

    // Optimized animation functions with throttling
    const throttledScrollHandler = throttle(function() {
        animateOnScroll();
        animateSections();
    }, 16); // ~60fps

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.animate, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .glitch-in, .card-animate, .cyber-title');

        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            animatedElements.forEach(element => {
                if (!element.classList.contains('animation-triggered') && isElementInViewport(element)) {
                    element.classList.add('active');
                    element.classList.add('animation-triggered');
                }
            });
        });
    }

    function animateSections() {
        const sections = document.querySelectorAll('section');

        requestAnimationFrame(() => {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                const windowHeight = window.innerHeight;

                if (sectionTop < windowHeight && sectionBottom > 0) {
                    const visibleHeight = Math.min(sectionBottom, windowHeight) - Math.max(sectionTop, 0);
                    const visiblePercent = visibleHeight / rect.height;

                    section.style.opacity = 0.4 + visiblePercent * 0.6;
                    section.style.transform = `scale(${0.95 + visiblePercent * 0.05})`;
                }
            });
        });
    }

    // Optimized initialization
    function initializeAnimations() {
        mark('animations-init');

        // Batch DOM queries
        const animatedElements = document.querySelectorAll('.animate, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .glitch-in, .card-animate, .cyber-title');
        const skillBars = document.querySelectorAll('.skill-progress');
        const containers = document.querySelectorAll('.cascade-container');

        // Use requestAnimationFrame for batch processing
        requestAnimationFrame(() => {
            animatedElements.forEach(element => {
                element.classList.add('active');
                element.classList.add('animation-triggered');
            });

            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width') || bar.style.width;
                if (width) {
                    bar.classList.add('active');
                    bar.classList.add('animation-triggered');
                    bar.style.width = width;
                }
            });

            // Setup cascade animations
            containers.forEach(container => {
                const items = container.querySelectorAll('.cascade-item');
                items.forEach((item, index) => {
                    const delay = index * 0.1;
                    item.style.transitionDelay = `${delay}s`;
                });
            });
        });

        // Add scroll listeners with passive option for better performance
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });

        measure('js-execution', 'js-start', 'animations-init');
    }

    // Menu toggle functionality with language switcher control
    ready(function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const langSwitcher = document.querySelector('.lang-switcher');

        function closeMenu() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');

                // Show language switcher when menu closes
                if (langSwitcher) {
                    langSwitcher.classList.remove('hidden');
                    console.log('🌐 Language switcher shown (menu closed)');
                }

                console.log('🍔 Menu closed');
            }
        }

        function openMenu() {
            if (navMenu) {
                navMenu.classList.add('active');

                // Hide language switcher when menu is open
                if (langSwitcher) {
                    langSwitcher.classList.add('hidden');
                    console.log('🌐 Language switcher hidden (menu opened)');
                }

                console.log('🍔 Menu opened');
            }
        }

        if (menuToggle && navMenu) {
            // Toggle menu on hamburger button click
            menuToggle.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Close menu when clicking on menu links
            const menuLinks = navMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Add visual feedback
                    this.style.transform = 'scale(0.95)';
                    this.style.opacity = '0.7';

                    // Close menu after a short delay for better UX
                    setTimeout(() => {
                        closeMenu();
                        console.log('🔗 Menu link clicked, closing menu');

                        // Reset visual feedback
                        this.style.transform = '';
                        this.style.opacity = '';
                    }, 150);
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    closeMenu();
                }
            });

            // Close menu on window resize (for responsive behavior)
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        }
    });

    // Optimized language switching
    ready(function() {
        const translations = {
            en: {
                'copyright': '&copy; 2025 ZeroPoint. All Rights Reserved.',
                'nav-home': 'Home',
                'nav-services': 'Services',
                'nav-portfolio': 'Portfolio',
                'nav-skills': 'Skills',
                'nav-contact': 'Contact',
                'hero-greeting': {
                    text: "Hi, I'm <span class='highlight'>Devopengin</span>",
                    glitch: "Hi, I'm Devopengin",
                },
                'hero-profession': {
                    text: "I'm a <span class='highlight'>[Developer / Designer]</span>",
                    glitch: "I'm a [Developer / Designer]",
                },
                'hero-description': 'Passionate web developer creating innovative digital solutions with a focus on modern technologies and user experience.',
                'hire-me': 'Write to me',
                'services-title': 'My <span class="highlight">Services</span>',
                'services-subtitle': 'What I can do for you',
                'portfolio-title': 'My <span class="highlight">Portfolio</span>',
                'portfolio-subtitle': 'Projects I\'ve worked on',
                'view-project': 'View Project',
                'portfolio-desc-porsche': 'Modern website showcasing Porsche cars with responsive design and smooth animations.',
                'portfolio-desc-porsche356': 'Interactive showcase of the legendary Porsche 356 with modern web technologies.',
                'portfolio-desc-travel': 'Beautiful animated travel website showcasing destinations with smooth parallax effects.',
                'web-dev-title': 'Web Development',
                'web-dev-desc': 'Creating responsive and dynamic websites with modern technologies.',
                'uiux-title': 'UI/UX Design',
                'uiux-desc': 'Designing intuitive and aesthetically pleasing user interfaces.',
                'skills-title': 'My <span class="highlight">Skills</span>',
                'skills-subtitle': 'Technologies I work with',
                'contact-title': 'Contact <span class="highlight">Me</span>',
                'contact-subtitle': 'Get in touch',
                'form-name': 'Your Name',
                'form-telegram': 'Your Telegram (username or @username)',
                'form-email': 'Your Email Address',
                'form-subject': 'Subject',
                'form-message': 'Your Message',
                'send-message': 'Send Message',
                'contact-method': 'Preferred contact method:',
                'contact-telegram': 'Telegram',
                'contact-email': 'Email',
                'form-success': 'Thank you! Your message has been sent successfully.',
                'form-error': 'Sorry, there was an error sending your message. Please try again.',
                'form-error-config': 'Messaging service is not configured. Please check console for instructions.',
                'form-sending': 'Sending...',
                'form-required': 'This field is required',
                'form-invalid-email': 'Please enter a valid email address',
                'form-error-bot-not-configured': 'Telegram bot is not configured. Please set up tokens according to TELEGRAM_SETUP.md instructions.'
            },
            ru: {
                'copyright': '&copy; 2025 ZероPoint. Все права защищены.',
                'nav-home': 'Главная',
                'nav-services': 'Услуги',
                'nav-portfolio': 'Портфолио',
                'nav-skills': 'Навыки',
                'nav-contact': 'Контакты',
                'hero-greeting': {
                    text: "Привет, Я <span class='highlight'>Devopengin</span>",
                    glitch: 'Привет, Я Devopengin',
                },
                'hero-profession': {
                    text: "Я <span class='highlight'>[Разработчик / Дизайнер]</span>",
                    glitch: 'Я [Разработчик / Дизайнер]',
                },
                'hero-description': 'Увлеченный веб-разработчик, создающий инновационные цифровые решения с фокусом на современных технологиях и пользовательском опыте.',
                'hire-me': 'Написать мне',
                'services-title': 'Мои <span class="highlight">Услуги</span>',
                'services-subtitle': 'Что я могу для вас сделать',
                'portfolio-title': '<span class="highlight">Портфолио</span>',
                'portfolio-subtitle': 'Проекты над которыми я работал',
                'view-project': 'Посмотреть',
                'portfolio-desc-porsche': 'Современный сайт, демонстрирующий автомобили Porsche с адаптивным дизайном и плавными анимациями.',
                'portfolio-desc-porsche356': 'Интерактивная витрина легендарного Porsche 356 с использованием современных веб-технологий.',
                'portfolio-desc-travel': 'Красивый анимированный сайт путешествий, демонстрирующий направления с плавными параллакс-эффектами.',
                'web-dev-title': 'Веб-разработка',
                'web-dev-desc': 'Создание адаптивных и динамичных веб-сайтов с использованием современных технологий.',
                'uiux-title': 'UI/UX Дизайн',
                'uiux-desc': 'Разработка интуитивно понятных и эстетически приятных пользовательских интерфейсов.',
                'skills-title': 'Мои <span class="highlight">Навыки</span>',
                'skills-subtitle': 'Технологии, с которыми я работаю',
                'contact-title': 'Связаться <span class="highlight">со мной</span>',
                'contact-subtitle': 'Свяжитесь со мной',
                'form-name': 'Ваше имя',
                'form-telegram': 'Ваш Telegram (username или @username)',
                'form-email': 'Ваш Email адрес',
                'form-subject': 'Тема',
                'form-message': 'Ваше сообщение',
                'send-message': 'Отправить сообщение',
                'contact-method': 'Предпочтительный способ связи:',
                'contact-telegram': 'Telegram',
                'contact-email': 'Email',
                'form-success': 'Спасибо! Ваше сообщение успешно отправлено.',
                'form-error': 'Извините, произошла ошибка при отправке сообщения. Попробуйте еще раз.',
                'form-error-config': 'Служба сообщений не настроена. Проверьте консоль для получения инструкций.',
                'form-sending': 'Отправка...',
                'form-required': 'Это поле обязательно для заполнения',
                'form-invalid-email': 'Введите корректный email адрес',
                'form-error-bot-not-configured': 'Telegram бот не настроен. Пожалуйста, настройте токены в соответствии с инструкциями в TELEGRAM_SETUP.md'
            }
        };

        // Function to get translation by key
        function getTranslation(key) {
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
            const translation = translations[savedLanguage];
            return translation && translation[key] ? (translation[key].text || translation[key]) : key;
        }

        // Make getTranslation globally available
        window.getTranslation = getTranslation;

        function setLanguage(lang) {
            const elements = document.querySelectorAll('[data-lang-key]');
            const translation = translations[lang];

            if (!translation) return;

            requestAnimationFrame(() => {
                elements.forEach(element => {
                    const translationKey = element.getAttribute('data-lang-key');
                    const translationValue = translation[translationKey];

                    if (translationValue) {
                        if (element.classList.contains('glitch-in')) {
                            const glitchText = translationValue.glitch || translationValue.text || translationValue;
                            element.setAttribute('data-text', glitchText);
                            element.innerHTML = translationValue.text || translationValue;
                        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                            element.placeholder = translationValue;
                        } else {
                            element.innerHTML = translationValue.text || translationValue;
                        }
                    }
                });

                // Update language switcher
                document.querySelectorAll('.lang-option').forEach(option => {
                    option.classList.remove('active');
                    if (option.getAttribute('data-lang') === lang) {
                        option.classList.add('active');
                    }
                });
            });

            // Save language preference
            localStorage.setItem('selectedLanguage', lang);
            document.cookie = `language=${lang}; path=/; max-age=31536000`;
        }

        // Initialize language
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        setLanguage(savedLanguage);

        // Language switcher event listeners
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                setLanguage(lang);
            });
        });

        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.checked = savedLanguage === 'ru';
            langToggle.addEventListener('change', () => {
                const newLang = langToggle.checked ? 'ru' : 'en';
                setLanguage(newLang);
            });
        }
    });

    // Active menu highlighting functionality
    ready(function() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const sections = document.querySelectorAll('section');

        function updateActiveMenuItem() {
            let current = '';

            // Определяем текущую активную секцию
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            // Убираем класс active со всех пунктов меню
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Добавляем класс active к текущему пункту меню
            if (current) {
                const activeLink = document.querySelector(`.nav-menu a[href="#${current}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }

        // Обновляем активный пункт меню при загрузке страницы
        updateActiveMenuItem();

        // Обновляем активный пункт меню при прокрутке
        window.addEventListener('scroll', throttle(updateActiveMenuItem, 100), { passive: true });
    });

    // Add passive event listeners for better performance
    window.addEventListener('resize', throttle(() => {
        // Handle resize if needed
    }, 100), { passive: true });

    // Mark JS execution end
    mark('js-end');
    measure('total-js-execution', 'js-start', 'js-end');

})();
