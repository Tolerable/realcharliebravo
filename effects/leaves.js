document.addEventListener('DOMContentLoaded', function() {
    // Create floating leaves container if it doesn't exist
    if (!document.getElementById('floatingLeaves')) {
        const leavesContainer = document.createElement('div');
        leavesContainer.id = 'floatingLeaves';
        leavesContainer.className = 'floating-leaves';
        document.body.appendChild(leavesContainer);
    }
    
    const leavesContainer = document.getElementById('floatingLeaves');
    
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
        
        // Using the built-in animate method
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
    setInterval(createLeaf, 2000);
    
    // Create initial leaves
    for (let i = 0; i < 10; i++) {
        createLeaf();
    }
});