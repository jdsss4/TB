document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('scroll-section');
    const title = document.getElementById('intro-content');
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    const card3 = document.getElementById('card3');

    const highlightWrapper = document.querySelector('.highlight-wrapper');
    const highlightActive = document.querySelector('.highlight-active');
    
    // --- Question Mark Variable ---
    const questionMark = document.querySelector('.question-mark');

    let gap1 = 120;
    let gap2 = 120;

    function updateGap() {
        const title1 = document.querySelector('#card1 .card-title');
        const title2 = document.querySelector('#card2 .card-title');
        const body1 = document.querySelector('#card1 .card-body');
        const body2 = document.querySelector('#card2 .card-body');

        if (!title1 || !title2 || !body1 || !body2) return;

        const isDesktop = window.innerWidth >= 1100;
        const isMobile = window.innerWidth <= 900;

        const paddingTop = isMobile ? 32 : 48;
        let verticalGap = 0;

        const overlay1 = document.querySelector('#card1 .card-content-overlay');
        const isRow = window.getComputedStyle(overlay1).flexDirection === 'row';

        if (isRow) {
            verticalGap = 16;
            gap1 = Math.max(title1.offsetHeight, body1.offsetHeight) + paddingTop + verticalGap;
            gap2 = Math.max(title2.offsetHeight, body2.offsetHeight) + paddingTop + verticalGap;
        } else {
            verticalGap = isMobile ? 32 : 48;
            gap1 = title1.offsetHeight + paddingTop + verticalGap;
            gap2 = title2.offsetHeight + paddingTop + verticalGap;
        }
    }

    function mapRange(value, inMin, inMax, outMin, outMax) {
        if (value <= inMin) return outMin;
        if (value >= inMax) return outMax;
        const scrollDistance = (value - inMin) / (inMax - inMin);
        return outMin + ((outMax - outMin) * scrollDistance);
    }

    function handleScroll() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const scrollableDistance = rect.height - windowHeight;
        let progress = scrollableDistance > 0 ? (-rect.top / scrollableDistance) : 0;
        progress = Math.max(0, Math.min(1, progress));

        const currentCardHeight = card3.offsetHeight;

        let adjGap1 = gap1;
        let adjGap2 = gap2;
        let totalStackHeight = currentCardHeight + adjGap1 + adjGap2;

        const minBaseTop = windowHeight < 600 ? 15 : 30;
        const availableHeight = windowHeight - minBaseTop - 30;

        if (totalStackHeight > availableHeight) {
            const overflow = totalStackHeight - availableHeight;
            const reduction = overflow / 2;
            adjGap1 = Math.max(50, gap1 - reduction);
            adjGap2 = Math.max(50, gap2 - reduction);
            totalStackHeight = currentCardHeight + adjGap1 + adjGap2;
        }

        let baseTop = windowHeight * 0.10;
        let maxBaseTop = windowHeight - totalStackHeight - 30;

        if (baseTop > maxBaseTop) { baseTop = maxBaseTop; }
        if (baseTop < minBaseTop) { baseTop = minBaseTop; }

        const finalScale = 0.98;

        const titleScale = mapRange(progress, 0.0, 0.10, 1, 0.65);
        const titleScrollDuration = 0.30 * windowHeight / (windowHeight - baseTop);
        const titleScrollEnd = 0.10 + titleScrollDuration;
        const titleY = mapRange(progress, 0.10, titleScrollEnd, 0, -windowHeight);
        title.style.transform = `translate3d(0, ${titleY}px, 0) scale(${titleScale})`;

        const card1Y = mapRange(progress, 0.0, 0.25, windowHeight, baseTop);
        const card2Y = mapRange(progress, 0.35, 0.55, windowHeight, baseTop + adjGap1);
        const card3Y = mapRange(progress, 0.60, 0.80, windowHeight, baseTop + adjGap1 + adjGap2);

        const card1Scale = mapRange(progress, 0.35, 1.0, 1, finalScale);
        const card2Scale = mapRange(progress, 0.65, 1.0, 1, finalScale);
        const card3Scale = mapRange(progress, 0.90, 1.0, 1, finalScale);

        card1.style.transform = `translate3d(0, ${card1Y}px, 0) scale(${card1Scale})`;
        card2.style.transform = `translate3d(0, ${card2Y}px, 0) scale(${card2Scale})`;
        card3.style.transform = `translate3d(0, ${card3Y}px, 0) scale(${card3Scale})`;
    }

    function handleHighlightScroll() {
        if (!highlightWrapper || !highlightActive) return;

        const rect = highlightWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const normalizedY = (rect.top + rect.height / 2) / windowHeight;
        const scrollProgress = 1 - normalizedY; 

        let rightInset = 100;
        let leftInset = 0;

        const revealStart = 0.25;
        const revealEnd = 0.45;  
        const hideStart = 0.55;  
        const hideEnd = 0.75;    

        if (scrollProgress < revealStart) {
            rightInset = 100;
            leftInset = 0;
        } else if (scrollProgress >= revealStart && scrollProgress < revealEnd) {
            let p = (scrollProgress - revealStart) / (revealEnd - revealStart);
            rightInset = 100 - (100 * p);
            leftInset = 0;
        } else if (scrollProgress >= revealEnd && scrollProgress < hideStart) {
            rightInset = 0;
            leftInset = 0;
        } else if (scrollProgress >= hideStart && scrollProgress < hideEnd) {
            let p = (scrollProgress - hideStart) / (hideEnd - hideStart);
            rightInset = 0;
            leftInset = 100 * p;
        } else if (scrollProgress >= hideEnd) {
            rightInset = 0;
            leftInset = 100;
        }

        highlightActive.style.clipPath = `inset(0% ${rightInset}% 0% ${leftInset}%)`;
    }

    function handleQuestionMarkScroll() {
        if (!questionMark) return;

        const rect = questionMark.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const startY = windowHeight * 0.6; 
        const endY = windowHeight * 0.3;

        let progress = (startY - rect.top) / (startY - endY);
        progress = Math.max(0, Math.min(1, progress));

        const dropDistance = progress * 150;
        const rotation = progress * 180;

        const scale = 0.25 + (progress * 0.75);

        const r = Math.round(progress * 188);
        const g = Math.round(progress * 28);
        const b = Math.round(progress * 26);

        questionMark.style.transform = `translate(-50%, -50%) translateY(${dropDistance}px) rotate(${rotation}deg) scale(${scale})`;
        questionMark.style.color = `rgb(${r}, ${g}, ${b})`;
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                handleHighlightScroll();
                handleQuestionMarkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', () => {
        updateGap();
        handleScroll();
        handleHighlightScroll();
        handleQuestionMarkScroll();
    });

    updateGap();
    handleScroll();
    handleHighlightScroll();
    handleQuestionMarkScroll();

    window.addEventListener('load', () => {
        updateGap();
        handleScroll();
        handleHighlightScroll();
        handleQuestionMarkScroll();
    });
});