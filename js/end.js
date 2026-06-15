gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray('.card-section');

cards.forEach((section) => {
    const content = section.querySelector('.contents');

    gsap.fromTo(content, 
        { y: "-30vh" }, 
        { 
            y: "30vh",  
            ease: "power2.inOut", 
            scrollTrigger: {
                trigger: section,
                start: "top bottom", 
                end: "bottom top",   
                scrub: 1             
            }
        }
    );
});