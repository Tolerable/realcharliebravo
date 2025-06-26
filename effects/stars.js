// Stars background effect
function initBackgroundEffect(intensity) {
    // Get container
    const container = document.getElementById('background-effect');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Set styles
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-9';
    
    // Determine number of stars based on intensity
    let starCount;
    switch(intensity) {
        case 'low':
            starCount = 100;
            break;
        case 'medium':
            starCount = 200;
            break;
        case 'high':
            starCount = 300;
            break;
        default:
            starCount = 200;
    }
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        createStar(container);
    }
}

function createStar(container) {
    const star = document.createElement('div');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size (1-3px)
    const size = Math.random() * 2 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.7 + 0.3;
    
    // Set styles
    star.style.position = 'absolute';
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = 'white';
    star.style.borderRadius = '50%';
    star.style.opacity = opacity;
    
    // Add twinkle animation
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s linear infinite`;
    
    // Add to container
    container.appendChild(star);
    
    // Create animation style if it doesn't exist
    if (!document.querySelector('#star-animation')) {
        const style = document.createElement('style');
        style.id = 'star-animation';
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: ${opacity}; }
                50% { opacity: ${opacity * 0.5}; }
                100% { opacity: ${opacity}; }
            }
        `;
        document.head.appendChild(style);
    }
}