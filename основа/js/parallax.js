// Скрипт для анимации параллакс-эффекта при скролле

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы параллакса
    const parallaxGrid = document.querySelector('.parallax-grid');
    const parallaxGlow = document.querySelector('.parallax-glow');
    const parallaxLines = document.querySelector('.parallax-lines');
    
    // Начальный масштаб
    let gridScale = 1;
    let glowScale = 1;
    let linesScale = 1;
    let linesRotation = 0;
    
    // Максимальные значения масштаба
    const maxGridScale = 2;
    const maxGlowScale = 1.5;
    const maxLinesScale = 1.3;
    const maxLinesRotation = 15;
    
    // Функция для плавного перехода между значениями
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Текущие значения для плавной анимации
    let currentGridScale = gridScale;
    let currentGlowScale = glowScale;
    let currentLinesScale = linesScale;
    let currentLinesRotation = linesRotation;
    
    // Обработчик события прокрутки
    window.addEventListener('scroll', function() {
        // Вычисляем процент прокрутки страницы
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Вычисляем новые значения масштаба в зависимости от прокрутки
        gridScale = 1 + scrollPercent * (maxGridScale - 1);
        glowScale = 1 + scrollPercent * (maxGlowScale - 1);
        linesScale = 1 + scrollPercent * (maxLinesScale - 1);
        linesRotation = scrollPercent * maxLinesRotation;
    });
    
    // Функция для анимации
    function animate() {
        // Плавно обновляем текущие значения
        currentGridScale = lerp(currentGridScale, gridScale, 0.05);
        currentGlowScale = lerp(currentGlowScale, glowScale, 0.03);
        currentLinesScale = lerp(currentLinesScale, linesScale, 0.02);
        currentLinesRotation = lerp(currentLinesRotation, linesRotation, 0.02);
        
        // Применяем трансформации
        if (parallaxGrid) {
            parallaxGrid.style.transform = `scale(${currentGridScale})`;
        }
        
        if (parallaxGlow) {
            parallaxGlow.style.transform = `scale(${currentGlowScale})`;
        }
        
        if (parallaxLines) {
            parallaxLines.style.transform = `scale(${currentLinesScale}) rotate(${currentLinesRotation}deg)`;
        }
        
        // Продолжаем анимацию
        requestAnimationFrame(animate);
    }
    
    // Запускаем анимацию
    animate();
    
    // Добавляем эффект параллакса при движении мыши
    document.addEventListener('mousemove', function(e) {
        if (!parallaxGrid || !parallaxGlow || !parallaxLines) return;
        
        // Вычисляем положение курсора относительно центра экрана
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Применяем небольшое смещение к слоям параллакса
        parallaxGrid.style.transform = `scale(${currentGridScale}) translate(${mouseX * -10}px, ${mouseY * -10}px)`;
        parallaxGlow.style.transform = `scale(${currentGlowScale}) translate(${mouseX * -20}px, ${mouseY * -20}px)`;
        parallaxLines.style.transform = `scale(${currentLinesScale}) rotate(${currentLinesRotation}deg) translate(${mouseX * -5}px, ${mouseY * -5}px)`;
    });
});

