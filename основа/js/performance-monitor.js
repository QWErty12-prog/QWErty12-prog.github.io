// Performance monitoring script
(function() {
    'use strict';

    // Only run in development or when explicitly requested
    if (window.location.search.indexOf('perf=1') === -1) return;

    const perfData = {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: 0,
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        resources: []
    };

    // Monitor DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        perfData.domContentLoaded = performance.now();
        console.log('🚀 DOM Content Loaded:', perfData.domContentLoaded.toFixed(2) + 'ms');
    });

    // Monitor Load Event
    window.addEventListener('load', function() {
        perfData.loadEventEnd = performance.now();
        console.log('⚡ Page Load Complete:', perfData.loadEventEnd.toFixed(2) + 'ms');

        // Log performance summary
        logPerformanceSummary();
    });

    // Monitor First Paint and First Contentful Paint
    if ('PerformanceObserver' in window) {
        try {
            // First Paint
            const paintObserver = new PerformanceObserver(function(list) {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-paint') {
                        perfData.firstPaint = entry.startTime;
                        console.log('🎨 First Paint:', perfData.firstPaint.toFixed(2) + 'ms');
                    } else if (entry.name === 'first-contentful-paint') {
                        perfData.firstContentfulPaint = entry.startTime;
                        console.log('📝 First Contentful Paint:', perfData.firstContentfulPaint.toFixed(2) + 'ms');
                    }
                }
            });
            paintObserver.observe({entryTypes: ['paint']});

            // Resource timing
            const resourceObserver = new PerformanceObserver(function(list) {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) { // Only log slow resources
                        perfData.resources.push({
                            name: entry.name,
                            duration: entry.duration,
                            type: entry.initiatorType
                        });
                    }
                }
            });
            resourceObserver.observe({entryTypes: ['resource']});

        } catch (e) {
            console.warn('Performance monitoring not fully supported:', e);
        }
    }

    // Log performance summary
    function logPerformanceSummary() {
        console.group('📊 Performance Summary');

        const navTiming = performance.timing;
        const pageLoad = navTiming.loadEventEnd - navTiming.navigationStart;
        const domReady = navTiming.domContentLoadedEventEnd - navTiming.navigationStart;
        const firstByte = navTiming.responseStart - navTiming.navigationStart;

        console.log('⏱️  Total Load Time:', pageLoad + 'ms');
        console.log('🌐 Time to First Byte:', firstByte + 'ms');
        console.log('📄 DOM Ready:', domReady + 'ms');

        if (perfData.firstPaint) {
            console.log('🎨 First Paint:', perfData.firstPaint.toFixed(2) + 'ms');
        }

        if (perfData.firstContentfulPaint) {
            console.log('📝 First Contentful Paint:', perfData.firstContentfulPaint.toFixed(2) + 'ms');
        }

        // Log slow resources
        if (perfData.resources.length > 0) {
            console.group('🐌 Slow Resources (>100ms):');
            perfData.resources.forEach(resource => {
                console.log(`  ${resource.type}: ${resource.name} (${resource.duration.toFixed(2)}ms)`);
            });
            console.groupEnd();
        }

        console.groupEnd();

        // Performance score (simplified)
        let score = 100;
        if (pageLoad > 3000) score -= 20;
        else if (pageLoad > 2000) score -= 10;

        if (domReady > 1500) score -= 15;
        else if (domReady > 1000) score -= 5;

        if (firstByte > 500) score -= 15;

        console.log('🏆 Performance Score:', Math.max(0, score) + '/100');
    }

    // Log current memory usage if available
    if ('memory' in performance) {
        setTimeout(() => {
            const memInfo = performance.memory;
            console.log('💾 Memory Usage:', {
                used: Math.round(memInfo.usedJSHeapSize / 1048576) + 'MB',
                total: Math.round(memInfo.totalJSHeapSize / 1048576) + 'MB',
                limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + 'MB'
            });
        }, 1000);
    }

})();

