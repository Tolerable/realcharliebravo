// Spotlight effect
function initSpotlightEffect(options) {
    // Get container
    const container = document.getElementById('spotlight-effect');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Set styles
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-8';
    container.style.pointerEvents = 'none';
    
    // Default options
    const defaults = {
        count: 2,
        size: 'medium',
        color: '#ffffff',
        blendMode: 'screen',
        followMouse: false,
        movement: 'circular'
    };
    
    // Merge options with defaults
    const settings = {...defaults, ...options};
    
    // Create spotlights
    for (let i = 0; i < settings.count; i++) {
        createSpotlight(container, i, settings);
    }
    
    // Setup mouse tracking if enabled
    if (settings.followMouse) {
        setupMouseTracking(container);
    }
}

function createSpotlight(container, index, settings) {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight';
    spotlight.id = `spotlight-${index}`;
    
    // Determine size
    let size;
    switch(settings.size) {
        case 'small':
            size = 150;
            break;
        case 'medium':
            size = 300;
            break;
        case 'large':
            size = 500;
            break;
        default:
            size = 300;
    }
    
    // Set styles
    spotlight.style.position = 'absolute';
    spotlight.style.width = `${size}px`;
    spotlight.style.height = `${size}px`;
    spotlight.style.borderRadius = '50%';
    spotlight.style.background = `radial-gradient(circle, ${settings.color} 0%, rgba(0,0,0,0) 70%)`;
    spotlight.style.opacity = '0.7';
    spotlight.style.mixBlendMode = settings.blendMode;
    spotlight.style.filter = 'blur(20px)';
    spotlight.style.transform = 'translate(-50%, -50%)';
    
    // Set initial position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    spotlight.style.left = `${x}%`;
    spotlight.style.top = `${y}%`;
    
    // Store position data
    spotlight.dataset.x = x;
    spotlight.dataset.y = y;
    
    // Add to container
    container.appendChild(spotlight);
    
    // Animate if not following mouse
    if (!settings.followMouse) {
        animateSpotlight(spotlight, index, settings);
    }
}

function animateSpotlight(spotlight, index, settings) {
    // Different movement patterns
    switch(settings.movement) {
        case 'circular':
            animateCircular(spotlight, index);
            break;
        case 'random':
            animateRandom(spotlight);
            break;
        case 'wave':
            animateWave(spotlight, index);
            break;
        default:
            animateCircular(spotlight, index);
    }
}

function animateCircular(spotlight, index) {
    // Center point
    const centerX = 50;
    const centerY = 50;
    
    // Radius and speed
    const radius = 30;
    const speedFactor = 0.05;
    
    // Offset for multiple spotlights
    const angleOffset = index * (2 * Math.PI / 3);
    
    // Animation function
    function move(timestamp) {
        // Calculate angle based on time
        const angle = (timestamp * speedFactor / 1000) + angleOffset;
        
        // Calculate new position
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Update position
        spotlight.style.left = `${x}%`;
        spotlight.style.top = `${y}%`;
        
        // Continue animation
        requestAnimationFrame(move);
    }
    
    // Start animation
    requestAnimationFrame(move);
}

function animateRandom(spotlight) {
    // Current position
    let x = parseFloat(spotlight.dataset.x);
    let y = parseFloat(spotlight.dataset.y);
    
    // Target position
    let targetX = Math.random() * 100;
    let targetY = Math.random() * 100;
    
    // Movement speed
    const speed = 0.02;
    
    // Animation function
    function move() {
        // Move towards target
        x += (targetX - x) * speed;
        y += (targetY - y) * speed;
        
        // Update position
        spotlight.style.left = `${x}%`;
        spotlight.style.top = `${y}%`;
        
        // Update data attributes
        spotlight.dataset.x = x;
        spotlight.dataset.y = y;
        
        // Check if close to target
        if (Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5) {
            // New target
            targetX = Math.random() * 100;
            targetY = Math.random() * 100;
        }
        
        // Continue animation
        requestAnimationFrame(move);
    }
    
    // Start animation
    requestAnimationFrame(move);
}

function animateWave(spotlight, index) {
    // Base position
    const baseX = 50;
    const baseY = 50;
    
    // Wave amplitude
    const amplitudeX = 40;
    const amplitudeY = 30;
    
    // Wave frequency
    const frequencyX = 0.001;
    const frequencyY = 0.002;
    
    // Phase shift for multiple spotlights
    const phaseShift = index * Math.PI;
    
    // Animation function
    function move(timestamp) {
        // Calculate new position
        const time = timestamp * 0.1;
        const x = baseX + amplitudeX * Math.sin(time * frequencyX + phaseShift);
        const y = baseY + amplitudeY * Math.cos(time * frequencyY + phaseShift);
        
        // Update position
        spotlight.style.left = `${x}%`;
        spotlight.style.top = `${y}%`;
        
        // Continue animation
        requestAnimationFrame(move);
    }
    
    // Start animation
    requestAnimationFrame(move);
}

function setupMouseTracking(container) {
    // Get first spotlight to follow mouse
    const spotlight = document.querySelector('.spotlight');
    
    // Listen for mouse movement
    document.addEventListener('mousemove', (event) => {
        // Get mouse position as percentage
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        
        // Update spotlight position
        spotlight.style.left = `${x}%`;
        spotlight.style.top = `${y}%`;
    });
}