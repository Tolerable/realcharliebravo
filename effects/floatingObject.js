// Floating Object special feature
function initSpecialFeature(options) {
    // Get container
    const container = document.getElementById('special-feature');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Set styles
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0';
    container.style.pointerEvents = 'none';
    
    // Create floating object
    const floatingObject = document.createElement('img');
    floatingObject.src = options.image;
    floatingObject.alt = 'Floating Object';
    floatingObject.style.position = 'absolute';
    floatingObject.style.width = '40px';
    floatingObject.style.height = 'auto';
    
    // Add to container
    container.appendChild(floatingObject);
    
    // Set initial position
    setRandomPosition(floatingObject);
    
    // Apply behavior
    switch(options.behavior) {
        case 'teleport':
            // Teleport to random position every 8 seconds
            setInterval(() => {
                // Fade out
                floatingObject.style.opacity = '0';
                
                // Wait for fade out, then change position and fade in
                setTimeout(() => {
                    setRandomPosition(floatingObject);
                    floatingObject.style.opacity = '1';
                }, 200);
            }, 8000);
            break;
            
        case 'float':
            // Continuous floating animation
            floatingObject.style.transition = 'all 10s ease-in-out';
            
            // Start animation loop
            const floatLoop = () => {
                setRandomPosition(floatingObject);
                setTimeout(floatLoop, 10000);
            };
            
            floatLoop();
            break;
            
        case 'pulse':
            // Static position with pulse animation
            setRandomPosition(floatingObject);
            
            // Add pulse animation
            floatingObject.style.animation = 'pulse 4s ease-in-out infinite';
            
            // Create animation style if it doesn't exist
            if (!document.querySelector('#pulse-animation')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation';
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            break;
    }
}

function setRandomPosition(element) {
    // Get window dimensions
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    
    // Safe area (keep element fully visible)
    const elemWidth = 40; // Element width (from style)
    const elemHeight = 60; // Estimated height based on width
    
    const safeMaxX = winWidth - elemWidth - 20;
    const safeMaxY = winHeight - elemHeight - 20;
    
    // Generate random position
    const x = Math.floor(Math.random() * safeMaxX) + 20;
    const y = Math.floor(Math.random() * safeMaxY) + 20;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // Set position
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.transform = `rotate(${rotation}deg)`;
}