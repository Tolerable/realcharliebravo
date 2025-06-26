// Particles background effect
function initParticlesEffect(options) {
    // Get container
    const container = document.getElementById('particles-effect');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Set styles
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-9';
    
    // Default options
    const defaults = {
        count: 150,
        minSize: 2,
        maxSize: 6,
        speed: 'medium',
        color: '#ffffff',
        connectParticles: false
    };
    
    // Merge options with defaults
    const settings = {...defaults, ...options};
    
    // Create particles
    const particles = [];
    for (let i = 0; i < settings.count; i++) {
        particles.push(createParticle(container, settings));
    }
    
    // Add connection lines if enabled
    if (settings.connectParticles) {
        addConnections(container, particles, settings);
    }
    
    // Animation loop
    if (settings.speed !== 'none') {
        animateParticles(particles, settings);
    }
}

function createParticle(container, settings) {
    const particle = document.createElement('div');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size between min and max
    const size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.3;
    
    // Set styles
    particle.style.position = 'absolute';
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = settings.color;
    particle.style.borderRadius = '50%';
    particle.style.opacity = opacity;
    
    // Store particle data for animation
    particle.dataset.x = x;
    particle.dataset.y = y;
    particle.dataset.size = size;
    particle.dataset.opacity = opacity;
    
    // Random direction
    particle.dataset.directionX = Math.random() > 0.5 ? 1 : -1;
    particle.dataset.directionY = Math.random() > 0.5 ? 1 : -1;
    
    // Add to container
    container.appendChild(particle);
    
    return particle;
}

function animateParticles(particles, settings) {
    // Determine speed value
    let speedFactor;
    switch(settings.speed) {
        case 'slow':
            speedFactor = 0.02;
            break;
        case 'medium':
            speedFactor = 0.05;
            break;
        case 'fast':
            speedFactor = 0.1;
            break;
        default:
            speedFactor = 0.05;
    }
    
    // Animation function
    function move() {
        particles.forEach(particle => {
            // Get current position
            let x = parseFloat(particle.dataset.x);
            let y = parseFloat(particle.dataset.y);
            
            // Get directions
            let dirX = parseFloat(particle.dataset.directionX);
            let dirY = parseFloat(particle.dataset.directionY);
            
            // Update position
            x += speedFactor * dirX;
            y += speedFactor * dirY;
            
            // Check boundaries
            if (x > 100 || x < 0) {
                dirX *= -1;
                particle.dataset.directionX = dirX;
            }
            
            if (y > 100 || y < 0) {
                dirY *= -1;
                particle.dataset.directionY = dirY;
            }
            
            // Update data attributes
            particle.dataset.x = x;
            particle.dataset.y = y;
            
            // Update position
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
        });
        
        // Update connections if enabled
        if (settings.connectParticles && particles.length > 1) {
            updateConnections(particles, settings);
        }
        
        requestAnimationFrame(move);
    }
    
    // Start animation
    requestAnimationFrame(move);
}

function addConnections(container, particles, settings) {
    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'particles-connections';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.zIndex = '-8';
    svg.style.pointerEvents = 'none';
    
    container.appendChild(svg);
}

function updateConnections(particles, settings) {
    // Get SVG element
    const svg = document.getElementById('particles-connections');
    
    // Clear existing connections
    svg.innerHTML = '';
    
    // Maximum distance for connection
    const maxDistance = 15; // percentage of viewport
    
    // Create connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            
            // Calculate distance
            const x1 = parseFloat(p1.dataset.x);
            const y1 = parseFloat(p1.dataset.y);
            const x2 = parseFloat(p2.dataset.x);
            const y2 = parseFloat(p2.dataset.y);
            
            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            
            // Draw line if close enough
            if (distance < maxDistance) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / maxDistance);
                
                // Create line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', `${x1}%`);
                line.setAttribute('y1', `${y1}%`);
                line.setAttribute('x2', `${x2}%`);
                line.setAttribute('y2', `${y2}%`);
                line.setAttribute('stroke', settings.color);
                line.setAttribute('stroke-opacity', opacity * 0.5);
                line.setAttribute('stroke-width', '1');
                
                svg.appendChild(line);
            }
        }
    }
}