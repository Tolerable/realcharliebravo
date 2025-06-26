/**
 * Shared animations for Blow Flow Creationz
 * This script handles various visual effects across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create floating cannabis leaves animation
    const leavesContainer = document.getElementById('floatingLeaves');
    
    if (!leavesContainer) {
        console.warn('Leaves container not found');
        return;
    }
    
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Random horizontal position
        leaf.style.left = Math.random() * 100 + 'vw';
        
        // Set position to bottom of screen
        leaf.style.top = 'auto';
        leaf.style.bottom = '-50px';
        
        // Random leaf size
        const leafSize = Math.random() * 30 + 20;
        leaf.style.width = leafSize + 'px';
        leaf.style.height = leafSize + 'px';
        
        // Keep the PNG image
        leaf.style.backgroundImage = 'url("/img/cannabis-leaf.png")';
        
        // Add to container
        leavesContainer.appendChild(leaf);
        
        // Float animation
        const duration = Math.random() * 15 + 15;
        
        // Using the built-in animate method that works with existing code
        leaf.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
            { transform: 'translateY(-100px) rotate(60deg)', opacity: 0.7, offset: 0.1 },
            { transform: 'translateY(-300px) rotate(120deg)', opacity: 0.7, offset: 0.3 },
            { transform: 'translateY(-600px) rotate(240deg)', opacity: 0.7, offset: 0.6 },
            { transform: 'translateY(-1000px) rotate(360deg)', opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'linear',
            fill: 'forwards'
        });
        
        // Remove leaf after animation
        setTimeout(() => {
            leaf.remove();
        }, duration * 1000);
    }
    
    // Create leaves every 2 seconds
    const leafInterval = setInterval(createLeaf, 2000);
    
    // Create initial leaves
    for (let i = 0; i < 10; i++) {
        createLeaf();
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's the cart link
            if (this.getAttribute('href') === '#cart') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add parallax effect to background elements
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Parallax for logo background
        const logoBackground = document.querySelector('.logo-background');
        if (logoBackground) {
            logoBackground.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.05}px))`;
        }
        
        // Parallax for light rays
        const lightRays = document.querySelector('.light-rays');
        if (lightRays) {
            lightRays.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.strain-card, .product-card, .merch-card, .featured-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});