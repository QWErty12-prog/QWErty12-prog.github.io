// Video Background Manager
(function() {
    'use strict';

    class VideoBackgroundManager {
        constructor() {
            this.video = null;
            this.isInitialized = false;
            this.playAttempts = 0;
            this.maxPlayAttempts = 3;
            this.checkInterval = null;
            this.criticalTimeInterval = null;
            this.isPageVisible = true;
            this.lastKnownTime = 0;
            this.stuckDetectionCount = 0;
            this.criticalTimeStart = 18; // Начать активный мониторинг за 3 секунды до проблемного времени
            this.criticalTimeEnd = 25;   // Закончить активный мониторинг через 4 секунды после проблемного времени

            this.init();
        }

        init() {
            console.log('🎬 Initializing Video Background Manager...');

            // Find video element
            this.video = document.getElementById('video-background');

            if (!this.video) {
                console.warn('❌ Video background element not found');
                return;
            }

            console.log('✅ Video element found');

            // Set up event listeners
            this.setupEventListeners();

            // Set up visibility change handler
            this.setupVisibilityHandler();

            // Set up performance monitoring
            this.setupPerformanceMonitoring();

            // Initial video setup
            this.setupVideo();

            this.isInitialized = true;
            console.log('🎬 Video Background Manager initialized successfully');
        }

        setupEventListeners() {
            // Video events
            this.video.addEventListener('loadstart', () => {
                console.log('🎬 Video load started');
            });

            this.video.addEventListener('loadeddata', () => {
                console.log('🎬 Video data loaded');
                this.ensureVideoPlays();
            });

            this.video.addEventListener('play', () => {
                console.log('🎬 Video started playing');
                this.playAttempts = 0; // Reset attempts on successful play
                this.startCriticalTimeMonitoring();
            });

            this.video.addEventListener('pause', () => {
                console.log('🎬 Video paused');
                // Останавливаем критический мониторинг при паузе
                if (this.criticalTimeInterval) {
                    clearInterval(this.criticalTimeInterval);
                    this.criticalTimeInterval = null;
                }
                // Only try to resume if page is visible and video should be playing
                if (this.isPageVisible && !this.video.ended) {
                    setTimeout(() => this.ensureVideoPlays(), 100);
                }
            });

            this.video.addEventListener('ended', () => {
                console.log('🎬 Video ended (should loop)');
                this.ensureVideoPlays();
            });

            this.video.addEventListener('error', (e) => {
                console.error('❌ Video error:', e);
                this.handleVideoError();
            });

            // Window events
            window.addEventListener('focus', () => {
                console.log('🎬 Window focused');
                this.ensureVideoPlays();
            });

            window.addEventListener('blur', () => {
                console.log('🎬 Window blurred');
            });

            // Touch events for mobile
            document.addEventListener('touchstart', () => {
                if (this.video && this.video.paused) {
                    this.ensureVideoPlays();
                }
            }, { passive: true });
        }

        setupVisibilityHandler() {
            // Handle page visibility changes
            let hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }

            if (typeof document.addEventListener !== "undefined" && typeof hidden !== "undefined") {
                document.addEventListener(visibilityChange, () => {
                    this.isPageVisible = !document[hidden];

                    if (this.isPageVisible) {
                        console.log('🎬 Page became visible');
                        // Small delay to ensure DOM is ready
                        setTimeout(() => this.ensureVideoPlays(), 100);
                    } else {
                        console.log('🎬 Page became hidden');
                    }
                });
            }
        }

        setupPerformanceMonitoring() {
            // Check video status periodically
            this.checkInterval = setInterval(() => {
                if (this.video && this.isPageVisible && this.video.paused && !this.video.ended) {
                    console.log('🎬 Periodic check: Video is paused, attempting to resume');
                    this.ensureVideoPlays();
                }
            }, 5000); // Check every 5 seconds

            // Clean up on page unload
            window.addEventListener('beforeunload', () => {
                if (this.checkInterval) {
                    clearInterval(this.checkInterval);
                }
                if (this.criticalTimeInterval) {
                    clearInterval(this.criticalTimeInterval);
                }
            });
        }

        startCriticalTimeMonitoring() {
            console.log('🎯 Starting critical time monitoring');

            // Остановить предыдущий мониторинг, если он был
            if (this.criticalTimeInterval) {
                clearInterval(this.criticalTimeInterval);
            }

            this.criticalTimeInterval = setInterval(() => {
                if (!this.video || !this.isPageVisible) return;

                const currentTime = this.video.currentTime;
                const timeToCritical = this.criticalTimeStart - currentTime;

                // Логируем приближение к критическому времени
                if (timeToCritical > 0 && timeToCritical <= 3 && Math.floor(timeToCritical) !== Math.floor(timeToCritical + 0.2)) {
                    console.log(`⏰ ${timeToCritical.toFixed(1)}s until critical time monitoring starts`);
                }

                // Проверяем, находимся ли мы в критическом временном интервале
                if (currentTime >= this.criticalTimeStart && currentTime <= this.criticalTimeEnd) {
                    console.log(`🎯 Critical monitoring active: ${currentTime.toFixed(1)}s`);

                    // Проверяем, не зависло ли видео
                    if (Math.abs(currentTime - this.lastKnownTime) < 0.1 && !this.video.paused) {
                        this.stuckDetectionCount++;
                        console.log(`🚨 Video potentially stuck at ${currentTime.toFixed(1)}s (detection count: ${this.stuckDetectionCount})`);

                        if (this.stuckDetectionCount >= 3) {
                            console.log('🚨 Video confirmed stuck, forcing restart');
                            this.forceVideoRestart();
                            this.stuckDetectionCount = 0;
                        }
                    } else {
                        // Видео движется нормально
                        this.stuckDetectionCount = 0;
                        this.lastKnownTime = currentTime;
                    }
                } else {
                    // Вне критического интервала, сбрасываем счетчик
                    this.stuckDetectionCount = 0;
                    this.lastKnownTime = currentTime;
                }
            }, 200); // Проверяем каждые 200мс в критический период
        }

        forceVideoRestart() {
            console.log('🔧 Force restarting video');

            if (!this.video) return;

            // Сохраняем текущее состояние
            const wasPlaying = !this.video.paused;
            const currentTime = this.video.currentTime;

            // Принудительно перезапускаем видео
            this.video.load();

            // После загрузки восстанавливаем позицию и воспроизведение
            setTimeout(() => {
                if (this.video) {
                    this.video.currentTime = currentTime;
                    if (wasPlaying && this.isPageVisible) {
                        this.ensureVideoPlays();
                    }
                }
            }, 100);
        }

        setupVideo() {
            // Ensure video properties are set correctly
            this.video.muted = true;
            this.video.loop = true;
            this.video.playsInline = true;
            this.video.preload = 'auto';

            // Force load if not already loaded
            if (this.video.readyState === 0) {
                this.video.load();
            }

            // Try to play after a short delay
            setTimeout(() => {
                this.ensureVideoPlays();
            }, 100);
        }

        async ensureVideoPlays() {
            if (!this.video || !this.isPageVisible) {
                return;
            }

            // Don't attempt too many times
            if (this.playAttempts >= this.maxPlayAttempts) {
                console.log('🎬 Max play attempts reached, stopping');
                return;
            }

            try {
                // Check if video can play
                if (this.video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                    const playPromise = this.video.play();

                    if (playPromise !== undefined) {
                        await playPromise;
                        this.playAttempts = 0; // Reset on success
                    }
                } else {
                    // Video not ready, try again later
                    console.log('🎬 Video not ready, retrying...');
                    this.playAttempts++;
                    setTimeout(() => this.ensureVideoPlays(), 500);
                }
            } catch (error) {
                console.log('🎬 Play attempt failed:', error.message);
                this.playAttempts++;

                // If it's an autoplay policy error, try again with user interaction
                if (error.name === 'NotAllowedError') {
                    console.log('🎬 Autoplay blocked, will retry on user interaction');
                    // Wait for user interaction
                    const retryOnInteraction = () => {
                        this.ensureVideoPlays();
                        document.removeEventListener('click', retryOnInteraction);
                        document.removeEventListener('touchstart', retryOnInteraction);
                    };
                    document.addEventListener('click', retryOnInteraction, { once: true });
                    document.addEventListener('touchstart', retryOnInteraction, { once: true });
                } else {
                    // Retry after delay for other errors
                    setTimeout(() => this.ensureVideoPlays(), 1000);
                }
            }
        }

        handleVideoError() {
            console.error('❌ Video error occurred');

            // Try to reload the video
            if (this.video) {
                console.log('🎬 Attempting to reload video');
                this.video.load();

                setTimeout(() => {
                    this.ensureVideoPlays();
                }, 1000);
            }
        }

        // Public method to manually restart video
        restartVideo() {
            console.log('🎬 Manual video restart requested');
            if (this.video) {
                this.video.currentTime = 0;
                this.ensureVideoPlays();
            }
        }

        // Public method to test critical time period
        testCriticalTime() {
            console.log('🧪 Testing critical time period');
            if (this.video) {
                this.video.currentTime = 19; // Устанавливаем на 19 секунду (перед проблемной зоной)
                this.ensureVideoPlays();
                console.log('🧪 Jumped to 19s, monitoring for issues...');
            }
        }

        // Public method to get video status
        getVideoStatus() {
            if (!this.video) return 'Video not found';

            return {
                currentTime: this.video.currentTime,
                duration: this.video.duration,
                paused: this.video.paused,
                ended: this.video.ended,
                readyState: this.video.readyState,
                networkState: this.video.networkState,
                lastKnownTime: this.lastKnownTime,
                stuckDetectionCount: this.stuckDetectionCount,
                criticalMonitoring: !!this.criticalTimeInterval
            };
        }

        // Public method to pause video
        pauseVideo() {
            if (this.video && !this.video.paused) {
                this.video.pause();
                console.log('🎬 Video paused manually');
            }
        }

        // Public method to resume video
        resumeVideo() {
            if (this.video && this.video.paused) {
                this.ensureVideoPlays();
            }
        }

        // Cleanup method
        destroy() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }

            if (this.video) {
                this.video.pause();
                this.video.currentTime = 0;
            }

            console.log('🎬 Video Background Manager destroyed');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.videoManager = new VideoBackgroundManager();
        });
    } else {
        window.videoManager = new VideoBackgroundManager();
    }

    // Add to global scope for debugging
    window.VideoBackgroundManager = VideoBackgroundManager;

})();
