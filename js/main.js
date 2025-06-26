// Initialize site on document load
// In your main.js file, modify the DOMContentLoaded event handler:
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in preview mode FIRST
    const urlParams = new URLSearchParams(window.location.search);
    const isPreviewMode = urlParams.get('preview') === 'true';

    if (isPreviewMode) {
        // Load config from localStorage
        const previewConfigStr = localStorage.getItem('previewConfig');
        
        if (previewConfigStr) {
            try {
                // Parse the preview config
                const previewConfig = JSON.parse(previewConfigStr);
                
                // Set it as the active config
                window.siteConfig = previewConfig;
                
                // Add preview banner
                const previewBanner = document.createElement('div');
                previewBanner.className = 'preview-banner';
                previewBanner.style.position = 'fixed';
                previewBanner.style.top = '0';
                previewBanner.style.left = '0';
                previewBanner.style.width = '100%';
                previewBanner.style.padding = '8px 15px';
                previewBanner.style.background = previewConfig.colors ? previewConfig.colors.alert : '#FF5722';
                previewBanner.style.color = 'white';
                previewBanner.style.zIndex = '9999';
                previewBanner.style.display = 'flex';
                previewBanner.style.justifyContent = 'space-between';
                previewBanner.style.alignItems = 'center';
                
                previewBanner.innerHTML = `
                    <div class="preview-banner-text" style="font-family: ${previewConfig.fonts ? previewConfig.fonts.heading : "'Orbitron', sans-serif"}; font-weight: bold; letter-spacing: 1px;">PREVIEW MODE</div>
                    <button id="back-to-config" style="background: rgba(255, 255, 255, 0.2); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">← Back to Configuration</button>
                `;
                document.body.insertBefore(previewBanner, document.body.firstChild);
                
                // Add margin to body to compensate for the banner
                document.body.style.marginTop = '40px';
                
                // Add back to config button event listener
                const backButton = document.getElementById('back-to-config');
                if (backButton) {
                    backButton.addEventListener('click', function() {
                        window.location.href = 'setup.html';
                    });
                }
                
                console.log('Preview mode active - using configuration from localStorage');
                
                // Initialize the site with the preview config
                initializeSite();
                
                // Important: Return early to prevent loading the standard config
                return;
            } catch (error) {
                console.error('Error parsing preview config:', error);
                // If there's an error, continue with normal initialization
            }
        }
    }

	// Handle navigation clicks
	document.getElementById('main-navigation').addEventListener('click', function(e) {
		if (e.target.tagName === 'A') {
			const targetHref = e.target.getAttribute('href');
			
			// Only handle internal links that start with #
			if (targetHref && targetHref.startsWith('#')) {
				e.preventDefault();
				
				if (targetHref === '#about') {
					// Hide all sections first
					document.querySelectorAll('section').forEach(section => {
						section.style.display = 'none';
					});
					// Show about section
					document.getElementById('about').style.display = 'block';
				} else {
					// For ALL other # links, show the full main page
					
					// Hide about section if it's open
					document.getElementById('about').style.display = 'none';
					
					// Show ALL main content sections
					document.getElementById('products').style.display = 'block';
					document.querySelector('.filter-section').style.display = 'flex';
					
					// Always show strain tree if enabled
					const strainTreeSection = document.getElementById('strain-tree-section');
					if (strainTreeSection && window.siteConfig?.strainTree?.enabled === true) {
						strainTreeSection.style.display = 'block';
					}
					
					// Always show partner section if enabled  
					const partnerSection = document.getElementById('partner-showcase');
					if (partnerSection && window.siteConfig?.friendLinksShowcase?.enabled === true) {
						partnerSection.style.display = 'block';
					}
					
					// Reset filter to show all products
					document.querySelectorAll('.filter-button').forEach(btn => {
						btn.classList.remove('active');
					});
					document.querySelector('.filter-button[data-filter="all"]').classList.add('active');
					
					document.querySelectorAll('.product-card').forEach(card => {
						card.style.display = 'block';
					});
					
					// Scroll to the target section if it exists
					const targetSection = document.querySelector(targetHref);
					if (targetSection) {
						setTimeout(() => {
							targetSection.scrollIntoView({ behavior: 'smooth' });
						}, 100);
					}
				}
			}
			// External links (http://, https://) will work normally
		}
	});

	function logError(message, error) {
		console.error(message, error);
		
		// Create a visible error log for users if in debug mode
		if (window.location.search.includes('debug=true')) {
			const errorLog = document.getElementById('error-log') || createErrorLog();
			const errorItem = document.createElement('div');
			errorItem.className = 'error-item';
			errorItem.innerHTML = `<strong>${message}</strong>: ${error.message || error}`;
			errorLog.appendChild(errorItem);
		}
	}

	function createErrorLog() {
		const errorLog = document.createElement('div');
		errorLog.id = 'error-log';
		errorLog.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; max-height: 200px; overflow-y: auto; background: rgba(255,0,0,0.8); color: white; padding: 10px; z-index: 9999; font-family: monospace;';
		errorLog.innerHTML = '<h3>Error Log</h3>';
		document.body.appendChild(errorLog);
		return errorLog;
	}
    
	// Function to check if config exists - ONLY RUN if not in preview mode
	function checkConfig() {
		if (typeof window.siteConfig === 'undefined') {
			// Try to load from /js/ folder if not already loaded
			const configScript = document.createElement('script');
			// Build path based on current location to support subfolder deployments
			const basePath = window.location.pathname.replace(/\/[^/]*$/, '/');
			configScript.src = basePath + 'js/config.js';
			configScript.onload = function() {
				console.log('Successfully loaded config.js from ' + basePath + 'js/ folder');
				initializeSite();
			};
			configScript.onerror = function() {
				console.error('Failed to load config.js from ' + basePath + 'js/ folder');
				// Create fallback config
				window.siteConfig = {
					// Default config values (unchanged)
					site: {
						name: "Site is Loading...",
						tagline: "Configuration Issue",
						logo: "",
						email: "",
						copyright: "© " + new Date().getFullYear()
					},
					colors: {
						primary: "#003B6F",
						secondary: "#00FF9F",
						tertiary: "#6A0DAD",
						highlight: "#FFD700", 
						alert: "#FF5722",
						background: "#0A0E17",
						text: "#FFFFFF"
					},
					fonts: {
						heading: "'Orbitron', sans-serif",
						body: "'Exo 2', sans-serif"
					},
					terminology: {
						category1: "Premium",
						category2: "Standard",
						category3: "Special",
						productTerm: "Item",
						productPluralTerm: "Items",
						packTerm: "Pack",
						cartTerm: "Cart",
						soldOutLabel: "SOLD OUT",
						comingSoonLabel: "COMING SOON"
					},
					navigation: [],
					effects: {
						backgroundEffect: { enabled: false },
						specialFeature: { enabled: false }
					},
					advanced: {
						enableLocalStorage: true,
						checkoutMethod: "email"
					},
					products: {
						defaultPackOptions: []
					}
				};
				// Show error message
				const errorMsg = document.createElement('div');
				errorMsg.style.cssText = 'background:#f44336;color:white;padding:15px;margin:20px;border-radius:5px;';
				errorMsg.innerHTML = `
					<h3>Configuration Error</h3>
					<p>The site configuration could not be loaded from either location.</p>
					<p>Please ensure config.js exists in the /js/ folder and is properly formatted.</p>
				`;
				document.body.insertBefore(errorMsg, document.body.firstChild);
				initializeSite();
			};
			document.head.appendChild(configScript);
			return false;
		}
		return true;
	}
    
    // For normal mode, check if config exists and then initialize
    // This will only run if not in preview mode or if preview config failed to load
    setTimeout(function() {
        if (checkConfig()) {
            initializeSite();
        }
    }, 300);
});

// Function to load real-time inventory data
function loadRealtimeInventory() {
    // Add timestamp or version number to prevent caching
    const cacheBuster = new Date().getTime();
    return fetch(`realtime-inventory.json?v=${cacheBuster}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Real-time inventory file not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded real-time inventory data');
            // Update products with data from JSON file
            if (data && Object.keys(data).length > 0) {
                // Create a deep copy of the existing products first
                let existingProducts = {};
                
                // Use config products if available
                if (window.siteConfig && window.siteConfig.products && window.siteConfig.products.items) {
                    // Create a deep copy to avoid reference issues
                    existingProducts = JSON.parse(JSON.stringify(window.siteConfig.products.items));
                }
                
                // Explicitly ensure status fields are properly formatted
                for (const id in data) {
                    if (data[id] && typeof data[id] === 'object') {
                        // Normalize status field to lowercase
                        if (data[id].status) {
                            data[id].status = data[id].status.toString().toLowerCase().trim();
                        }
                    }
                }
                
                // Merge with existing products
                window.products = { ...existingProducts, ...data };
                console.log('Combined products:', Object.keys(window.products).length);
                renderProductCards();
            }
        })
        .catch(error => {
            console.warn('Could not load real-time inventory:', error.message);
        });
}

// Function to initialize the About section
function initializeAboutSection() {
    const aboutConfig = window.siteConfig.about;
    if (!aboutConfig) return;
    
    // Set basic content
    document.getElementById('about-title').textContent = aboutConfig.title || 'About Us';
    document.getElementById('about-subtitle').textContent = aboutConfig.subtitle || '';
    
    // Set image
    const aboutImage = document.getElementById('about-image');
    if (aboutConfig.image) {
        // Add img/ prefix if needed
        let imagePath = aboutConfig.image;
        if (!imagePath.startsWith('img/') && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
            imagePath = 'img/' + imagePath;
        }
        aboutImage.src = imagePath;
        aboutImage.alt = aboutConfig.title;
    }
    
    // Set description
    const aboutDescription = document.getElementById('about-description');
    if (aboutConfig.description) {
        aboutDescription.innerHTML = formatTextWithParagraphs(aboutConfig.description);
    }
    
    // Handle team members
    const teamSection = document.getElementById('team-section');
    const teamGrid = document.getElementById('team-members-display');
    
    if (aboutConfig.teamMembers && aboutConfig.teamMembers.length > 0) {
        teamGrid.innerHTML = ''; // Clear existing
        
        aboutConfig.teamMembers.forEach(member => {
            if (!member.name) return; // Skip if no name
            
            const memberCard = document.createElement('div');
            memberCard.className = 'team-member-card';
            
            let imageHTML = '';
            if (member.image) {
                let imagePath = member.image;
                if (!imagePath.startsWith('img/') && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
                    imagePath = 'img/' + imagePath;
                }
                imageHTML = `<img src="${imagePath}" alt="${member.name}" class="team-member-image">`;
            }
            
            memberCard.innerHTML = `
                ${imageHTML}
                <div class="team-member-info">
                    <div class="team-member-name">${member.name}</div>
                    <div class="team-member-title">${member.title || ''}</div>
                    <div class="team-member-bio">${member.bio || ''}</div>
                </div>
            `;
            
            teamGrid.appendChild(memberCard);
        });
    } else {
        // Hide team section if no members
        teamSection.style.display = 'none';
    }
    
    // Handle history timeline
    const historySection = document.getElementById('history-section');
    const timelineContainer = document.getElementById('history-timeline');
    
    if (aboutConfig.historyItems && aboutConfig.historyItems.length > 0) {
        timelineContainer.innerHTML = ''; // Clear existing
        
        // Sort items by year
        const sortedItems = [...aboutConfig.historyItems].sort((a, b) => {
            // Try to parse as numbers first
            const yearA = parseInt(a.year);
            const yearB = parseInt(b.year);
            
            if (!isNaN(yearA) && !isNaN(yearB)) {
                return yearA - yearB;
            }
            
            // Fall back to string comparison
            return a.year.localeCompare(b.year);
        });
        
        sortedItems.forEach(item => {
            if (!item.year || !item.title) return; // Skip if missing required fields
            
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-description">${item.description || ''}</div>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });
    } else {
        // Hide history section if no items
        historySection.style.display = 'none';
    }
    
    // Handle additional sections
    const additionalSectionsContainer = document.getElementById('additional-sections');
    
    if (aboutConfig.additionalSections && aboutConfig.additionalSections.length > 0) {
        additionalSectionsContainer.innerHTML = ''; // Clear existing
        
        aboutConfig.additionalSections.forEach(section => {
            if (!section.title) return; // Skip if no title
            
            const sectionEl = document.createElement('div');
            sectionEl.className = 'about-additional-section';
            
            sectionEl.innerHTML = `
                <h3>${section.title}</h3>
                <div>${formatTextWithParagraphs(section.content || '')}</div>
            `;
            
            additionalSectionsContainer.appendChild(sectionEl);
        });
    } else {
        // Hide additional sections container if empty
        additionalSectionsContainer.style.display = 'none';
    }
    
    // Add a close button to the about section if it doesn't exist
    const aboutSection = document.getElementById('about');
    if (!aboutSection.querySelector('.close-about')) {
        const closeButton = document.createElement('span');
        closeButton.className = 'close-about';
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.fontSize = '30px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = window.siteConfig.colors.secondary;
        
        // Add event listener
        closeButton.addEventListener('click', function() {
            aboutSection.style.display = 'none';
        });
        
        // Get the container inside about section
        const aboutContainer = aboutSection.querySelector('.about-container');
        if (aboutContainer) {
            aboutContainer.style.position = 'relative';
            aboutContainer.appendChild(closeButton);
        } else {
            aboutSection.appendChild(closeButton);
        }
    }
}

// Helper function to format text with paragraphs
function formatTextWithParagraphs(text) {
    if (!text) return '';
    
    // Split by double newlines and create paragraphs
    return text.split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

// Function to initialize hover images
function initializeHoverImages() {
    // Find all product cards with hover images
    document.querySelectorAll('.product-card.has-hover-image').forEach(card => {
        const hoverImage = card.getAttribute('data-hover-image');
        if (hoverImage) {
            // Set the background image for the hover effect
            card.style.setProperty('--hover-image', `url('${hoverImage}')`);
            // Update the ::after pseudo-element with the hover image
            const style = document.createElement('style');
            const cardId = card.getAttribute('data-product');
            style.textContent = `.product-card[data-product="${cardId}"]::after { background-image: url('${hoverImage}'); }`;
            document.head.appendChild(style);
        }
    });
}

function initializeSite() {		
    // Check if siteConfig exists
    if (!window.siteConfig) {
        console.error('Error: siteConfig is not defined');
        // Display error and return
        return;
    }
    
    // Apply site configuration
    applySiteConfig();
	
    // Initialize age check if enabled
    initializeAgeCheck();	

    // Initialize about section
    initializeAboutSection();
    
    // Initialize effects
    initializeEffects();
    
    // Initialize cart
    initializeCart();
	
    initializeFriendLinks();
	
	// Initialize strain tree
    initializeStrainTree();
    
    // Check if we're in preview mode
    const isPreviewMode = window.location.search.includes('preview=true');
    
    if (isPreviewMode) {
        console.log('Preview mode detected - using config products only');
        
        // In preview mode, explicitly set window.products to config products
        if (window.siteConfig && window.siteConfig.products && window.siteConfig.products.items) {
            window.products = window.siteConfig.products.items;
            console.log('Set window.products from config with', Object.keys(window.products).length, 'items');
        }
        
        // Render product cards
        renderProductCards();
		// Initialize hover images for products
		initializeHoverImages();		
        setupEventListeners();
        addDigitalProductStyles();
    } else {
        // Load real-time inventory if NOT in preview mode
        loadRealtimeInventory()
            .then(() => {
                renderProductCards();
                setupEventListeners();
                addDigitalProductStyles();
            })
            .catch(error => {
                console.warn('Real-time inventory load failed:', error);
                renderProductCards();
                setupEventListeners();
                addDigitalProductStyles();
            });
    }
}

function addDigitalProductStyles() {
    // Create or get the dynamic styles element
    let dynamicStyles = document.getElementById('dynamic-styles');
    if (!dynamicStyles) {
        dynamicStyles = document.createElement('style');
        dynamicStyles.id = 'dynamic-styles';
        document.head.appendChild(dynamicStyles);
    }
    
    // Add digital product specific styles
    const digitalStyles = `
        /* Digital product indicator on cards */
        .product-card[data-delivery="digital"]:before {
            content: "DIGITAL";
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--highlight-color, #FFD700);
            color: var(--background-color, #0A0E17);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
            z-index: 5;
        }
        
        /* Digital product styles in modal */
        .digital-access-btn {
            background: linear-gradient(45deg, var(--primary-color), var(--tertiary-color));
            border: none;
            color: var(--text-color);
            font-weight: bold;
            letter-spacing: 1px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .digital-access-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            background: linear-gradient(45deg, var(--tertiary-color), var(--primary-color));
        }
        
        .digital-access-info {
            font-size: 0.9rem;
            color: var(--text-color);
            text-align: center;
        }
        
        .download-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
    `;
    
    // Add the styles to the page
    dynamicStyles.textContent += digitalStyles;
}

function addLegalDisclaimer(disclaimerText, siteName) {
    // Replace [Company Name] placeholder with actual site name
    const processedText = disclaimerText.replace(/\[Company Name\]/g, siteName);
    
    // Create disclaimer element
    const disclaimer = document.createElement('div');
    disclaimer.className = 'legal-disclaimer';
    disclaimer.innerHTML = `<p><strong>Legal Disclaimer:</strong> ${processedText}</p>`;
    
    // Add to footer or end of body
    const footer = document.querySelector('footer');
    if (footer) {
        footer.appendChild(disclaimer);
    } else {
        document.body.appendChild(disclaimer);
    }
}

// Apply site configuration from config.js or preview config
function applySiteConfig() {
   const siteConfig = window.siteConfig;
   
   // Set page title and meta tags
   document.title = siteConfig.site.name;
   document.querySelector('meta[name="title"]').setAttribute('content', siteConfig.site.name);
   document.querySelector('meta[name="description"]').setAttribute('content', siteConfig.site.tagline);
   
   // Set Open Graph meta tags
   const currentUrl = window.location.href.split('?')[0]; // Remove query parameters
   document.querySelector('meta[property="og:url"]').setAttribute('content', currentUrl);
   document.querySelector('meta[property="og:title"]').setAttribute('content', siteConfig.site.name);
   document.querySelector('meta[property="og:description"]').setAttribute('content', siteConfig.site.tagline);
   
   // Set Twitter meta tags
   document.querySelector('meta[name="twitter:url"]').setAttribute('content', currentUrl);
   document.querySelector('meta[name="twitter:title"]').setAttribute('content', siteConfig.site.name);
   document.querySelector('meta[name="twitter:description"]').setAttribute('content', siteConfig.site.tagline);

   // FIXED: Set social preview image properly
   if (siteConfig.site.socialPreview) {
       let socialImagePath = siteConfig.site.socialPreview;
       let fullImageUrl;
       
       // Get the base URL without any filename
       const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
       
       if (socialImagePath.startsWith('http://') || socialImagePath.startsWith('https://')) {
           // Already a full URL
           fullImageUrl = socialImagePath;
       } else if (socialImagePath.startsWith('/')) {
           // Absolute path from domain root
           fullImageUrl = window.location.origin + socialImagePath;
       } else {
           // Relative path - construct full URL
           if (socialImagePath.startsWith('img/')) {
               // Has img/ prefix
               fullImageUrl = baseUrl + '/' + socialImagePath;
           } else {
               // Just filename - assume it's in root directory
               fullImageUrl = baseUrl + '/' + socialImagePath;
           }
       }
       
       console.log('Setting social image URL to:', fullImageUrl);
       
       // Set both Open Graph and Twitter meta tags
       const ogImageTag = document.querySelector('meta[property="og:image"]');
       const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
       
       if (ogImageTag) {
           ogImageTag.setAttribute('content', fullImageUrl);
       } else {
           // Create the tag if it doesn't exist
           const newOgImageTag = document.createElement('meta');
           newOgImageTag.setAttribute('property', 'og:image');
           newOgImageTag.setAttribute('content', fullImageUrl);
           document.head.appendChild(newOgImageTag);
       }
       
       if (twitterImageTag) {
           twitterImageTag.setAttribute('content', fullImageUrl);
       } else {
           // Create the tag if it doesn't exist
           const newTwitterImageTag = document.createElement('meta');
           newTwitterImageTag.setAttribute('name', 'twitter:image');
           newTwitterImageTag.setAttribute('content', fullImageUrl);
           document.head.appendChild(newTwitterImageTag);
       }
       
       // Also add additional Open Graph image properties that some platforms require
       const ogImageSecureUrl = document.querySelector('meta[property="og:image:secure_url"]');
       if (!ogImageSecureUrl && fullImageUrl.startsWith('https://')) {
           const secureUrlTag = document.createElement('meta');
           secureUrlTag.setAttribute('property', 'og:image:secure_url');
           secureUrlTag.setAttribute('content', fullImageUrl);
           document.head.appendChild(secureUrlTag);
       }
       
       // Add image dimensions if known or set defaults
       const ogImageWidth = document.querySelector('meta[property="og:image:width"]');
       const ogImageHeight = document.querySelector('meta[property="og:image:height"]');
       
       if (!ogImageWidth) {
           const widthTag = document.createElement('meta');
           widthTag.setAttribute('property', 'og:image:width');
           widthTag.setAttribute('content', '1200'); // Standard social media width
           document.head.appendChild(widthTag);
       }
       
       if (!ogImageHeight) {
           const heightTag = document.createElement('meta');
           heightTag.setAttribute('property', 'og:image:height');
           heightTag.setAttribute('content', '630'); // Standard social media height
           document.head.appendChild(heightTag);
       }
       
       // Add image type
       const ogImageType = document.querySelector('meta[property="og:image:type"]');
       if (!ogImageType) {
           const typeTag = document.createElement('meta');
           typeTag.setAttribute('property', 'og:image:type');
           typeTag.setAttribute('content', 'image/jpeg'); // Assume JPEG, change if needed
           document.head.appendChild(typeTag);
       }	   
    }

	// Add legal disclaimer if enabled
	if (siteConfig.legal && siteConfig.legal.enableDisclaimer && siteConfig.legal.disclaimerText) {
		addLegalDisclaimer(siteConfig.legal.disclaimerText, siteConfig.site.name);
	}
   
   // Fix logo path handling
   let logoPath = siteConfig.site.logo;
   if (logoPath && !logoPath.startsWith('img/') && !logoPath.startsWith('/') && !logoPath.startsWith('http')) {
       logoPath = 'img/' + logoPath;
   }
   
   // Set site logo and name
   document.getElementById('site-logo').src = logoPath;
   document.getElementById('site-logo').alt = siteConfig.site.name;
   document.getElementById('site-name').textContent = siteConfig.site.name;
   
   // Set footer content
   document.getElementById('footerSiteName').textContent = siteConfig.site.name;
   document.getElementById('copyright-text').textContent = siteConfig.site.copyright;
   
   // Handle hero section
   setupHeroSection();
   
   // Check if shopping cart is enabled
   const shopEnabled = siteConfig.advanced && siteConfig.advanced.enableShop !== false; // Default to true if not set
   
   // Set cart terminology only if shop is enabled
   if (shopEnabled) {
       document.getElementById('cartTitle').textContent = `Your ${siteConfig.terminology.cartTerm}`;
       document.getElementById('cartEmptyMessage').textContent = `Your ${siteConfig.terminology.cartTerm} is empty`;
   }
   
   // Set navigation
   const mainNav = document.getElementById('main-navigation');
   mainNav.innerHTML = ''; // Clear existing navigation
   
   // Add navigation items from config
   siteConfig.navigation.forEach(item => {
       const li = document.createElement('li');
       li.innerHTML = `<a href="${item.url}">${item.name}</a>`;
       mainNav.appendChild(li);
   });
   
   // Add cart link only if shop is enabled
   if (shopEnabled) {
       const cartLi = document.createElement('li');
       cartLi.id = 'cart-nav-item';
       cartLi.innerHTML = `
           <a href="#cart" id="cart-link">
               <span>${siteConfig.terminology.cartTerm}</span>
               <span id="cart-count" class="cart-badge">0</span>
           </a>
       `;
       mainNav.appendChild(cartLi);
   }
   
   // CHANGED: Obfuscate email in contact links
   const contactLinks = document.getElementById('contact-links');
   contactLinks.innerHTML = '';
   
   const emailParts = siteConfig.site.email.split('@');
   const emailItem = document.createElement('li');
   emailItem.innerHTML = `<a href="#" onclick="window.location.href='mailto:' + '${emailParts[0]}' + '@' + '${emailParts[1]}'; return false;">${emailParts[0]}[at]${emailParts[1]}</a>`;
   contactLinks.appendChild(emailItem);
   
   // Add social links if they exist
   if (siteConfig.site.socialLinks && Array.isArray(siteConfig.site.socialLinks)) {
       siteConfig.site.socialLinks.forEach(socialLink => {
           if (socialLink.name && socialLink.url) {
               const socialItem = document.createElement('li');
               socialItem.innerHTML = `<a href="${socialLink.url}" target="_blank">${socialLink.name}</a>`;
               contactLinks.appendChild(socialItem);
           }
       });
   }
   
   // Set footer nav
   const footerNav = document.getElementById('footerNav');
   footerNav.innerHTML = ''; // Clear existing navigation
   siteConfig.navigation.forEach(item => {
       const li = document.createElement('li');
       li.innerHTML = `<a href="${item.url}">${item.name}</a>`;
       footerNav.appendChild(li);
   });
   
   // Apply custom styles from config
   applyCustomStyles();
   
   // Set pack options and checkout button text only if shop is enabled
   if (shopEnabled) {
       document.getElementById('packOptionsTitle').textContent = `Select ${siteConfig.terminology.packTerm} Size:`;
       document.getElementById('checkoutBtn').textContent = `Checkout`;
   }
   
   // Update filter buttons
   updateFilterButtons();
}

function initializeAgeCheck() {
    const siteConfig = window.siteConfig;
    
    // Check if age verification is enabled
    if (siteConfig.advanced && siteConfig.advanced.enableAgeCheck) {
        // Load the external age check script
        const script = document.createElement('script');
        script.src = 'js/agecheck.js';  // Make sure path is correct
        script.onload = () => console.log('Age check script loaded');
        script.onerror = () => console.error('Failed to load age check script');
        document.head.appendChild(script);
    }
}

// Open product modal in read-only mode (when shop is disabled)
function openProductModalReadOnly(product) {
    const modal = document.getElementById('productModal');
    const siteConfig = window.siteConfig;
    
    document.getElementById('modalTitle').textContent = product.name;
    
    // Fix main image path
    let mainImagePath = product.image;
    if (!mainImagePath) {
        // If main image is empty but there are additional images, use the first one
        if (product.additionalImages && product.additionalImages.length > 0) {
            mainImagePath = product.additionalImages[0];
        } else {
            // Fallback to a placeholder
            mainImagePath = 'img/placeholder.jpg';
        }
    }
    
    // Add img/ prefix if it doesn't exist
    if (mainImagePath && !mainImagePath.startsWith('img/') && !mainImagePath.startsWith('/') && !mainImagePath.startsWith('http')) {
        mainImagePath = 'img/' + mainImagePath;
    }
    
    document.getElementById('modalImage').src = mainImagePath;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalType').textContent = product.type;
    document.getElementById('modalRating').textContent = product.rating || 'N/A';
    document.getElementById('modalOrigin').textContent = product.origin || 'Various';
    document.getElementById('modalRarity').textContent = product.rarity || 'Standard';
    document.getElementById('modalVariety').textContent = product.variety || 'Premium';
	document.getElementById('modalDescription').innerHTML = (product.description || '').replace(/\n/g, '<br>');
	document.getElementById('modalDetails').innerHTML = (product.details || 'No additional details available.').replace(/\n/g, '<br>');
	document.getElementById('modalNotes').innerHTML = (product.notes || 'No special notes.').replace(/\n/g, '<br>');
    
    // Set up thumbnails gallery
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = '';

    // Add these lines to set the alignment directly
    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.style.flexWrap = 'wrap';
    thumbnailsContainer.style.gap = '10px';
    thumbnailsContainer.style.justifyContent = 'flex-start'; // Left alignment
    thumbnailsContainer.style.alignItems = 'center';
    
    // Add main product image as first thumbnail
    const mainThumb = document.createElement('div');
    mainThumb.className = 'modal-thumbnail active';
    mainThumb.innerHTML = `<img src="${mainImagePath}" alt="Main">`;
    mainThumb.addEventListener('click', function() {
        document.getElementById('modalImage').src = mainImagePath;
        document.querySelectorAll('.modal-thumbnail').forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
    });
    thumbnailsContainer.appendChild(mainThumb);
    
    // Add additional images if available
    if (product.additionalImages && product.additionalImages.length > 0) {
        product.additionalImages.forEach((imgSrc, index) => {
            // Fix additional image path
            let additionalImagePath = imgSrc;
            if (additionalImagePath && !additionalImagePath.startsWith('img/') && !additionalImagePath.startsWith('/') && !additionalImagePath.startsWith('http')) {
                additionalImagePath = 'img/' + additionalImagePath;
            }
            
            const thumb = document.createElement('div');
            thumb.className = 'modal-thumbnail';
            thumb.innerHTML = `<img src="${additionalImagePath}" alt="Image ${index + 1}">`;
            thumb.addEventListener('click', function() {
                document.getElementById('modalImage').src = additionalImagePath;
                document.querySelectorAll('.modal-thumbnail').forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
            thumbnailsContainer.appendChild(thumb);
        });
    }
    
    // Get the pack options container
    const packOptionsContainer = document.getElementById('packOptionButtons');
    if (!packOptionsContainer) return;
    
    // Clear existing content
    packOptionsContainer.innerHTML = '';
    
    // Get the title element
    const packOptionsTitle = document.getElementById('packOptionsTitle');
    if (packOptionsTitle) {
        packOptionsTitle.style.display = 'block';
    }
    
    // Check if this is a digital product with content
    if (product.delivery === 'digital' && product.digitalContent) {
        // Show digital product access button
        if (packOptionsTitle) {
            packOptionsTitle.textContent = 'Access Digital Content:';
            packOptionsTitle.style.color = siteConfig.colors.highlight || '#FFD700';
        }
        
        // Create access button for digital content
        const accessButton = document.createElement('button');
        accessButton.className = 'cta-button digital-access-btn';
        accessButton.innerHTML = `<i class="download-icon"></i> Access Digital Content`;
        accessButton.style.width = '100%';
        accessButton.style.marginTop = '10px';
        accessButton.style.padding = '12px 20px';
        accessButton.style.display = 'flex';
        accessButton.style.alignItems = 'center';
        accessButton.style.justifyContent = 'center';
        
        // Add info text
        const accessInfo = document.createElement('div');
        accessInfo.className = 'digital-access-info';
        accessInfo.innerHTML = `<p>Digital product. Click the button below to access content.</p>`;
        accessInfo.style.marginBottom = '15px';
        accessInfo.style.padding = '10px';
        accessInfo.style.borderRadius = '5px';
        accessInfo.style.backgroundColor = 'rgba(0,0,0,0.1)';
        
        // Add to container
        packOptionsContainer.appendChild(accessInfo);
        packOptionsContainer.appendChild(accessButton);
        
        // Add click handler
        accessButton.addEventListener('click', function() {
            // Open the digital content URL in a new tab
            window.open(product.digitalContent, '_blank');
            
            // Close the modal
            document.getElementById('productModal').style.display = 'none';
        });
    } else {
        // For physical products
        // Hide the pack options section if needed
        const packOptionsSection = document.getElementById('packOptions');
        if (packOptionsSection) {
            packOptionsSection.style.display = 'none';
        }
        
        // Add view-only message
        const viewOnlyMessage = document.createElement('div');
        viewOnlyMessage.className = 'view-only-message';
        viewOnlyMessage.innerHTML = `
            <p>This product is displayed for informational purposes only.</p>
            <p>Contact us for purchasing options.</p>
        `;
        viewOnlyMessage.style.marginTop = '20px';
        viewOnlyMessage.style.padding = '10px';
        viewOnlyMessage.style.backgroundColor = 'rgba(0,0,0,0.1)';
        viewOnlyMessage.style.borderRadius = '5px';
        viewOnlyMessage.style.textAlign = 'center';
        
        const modalInfo = document.querySelector('.modal-info');
        if (modalInfo) {
            modalInfo.appendChild(viewOnlyMessage);
        }
    }
    
    // Show modal
    modal.style.display = 'block';
}

function setupHeroSection() {
    const siteConfig = window.siteConfig;
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');

    // Get the hero background path with proper prefix handling
    let heroImagePath = '';
    if (siteConfig.site.heroBackground) {
        heroImagePath = siteConfig.site.heroBackground;
        if (!heroImagePath.startsWith('img/') && !heroImagePath.startsWith('/') && !heroImagePath.startsWith('http')) {
            heroImagePath = 'img/' + heroImagePath;
        }
    }

    // Check if we should show text or full image
    if (siteConfig.site.showHeroText === false) {
        // Full image mode - no dimming, no text
        
        // First, add the full-image class
        heroSection.classList.add('full-image');
        
        // Apply direct background image with no gradient
        heroSection.style.backgroundImage = `url('${heroImagePath}')`;
        
        // Make sure no inline gradient is applied
        heroSection.style.background = `url('${heroImagePath}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        
        // Hide text elements (redundant with CSS but for extra certainty)
        if (heroTitle) heroTitle.style.display = 'none';
        if (heroDescription) heroDescription.style.display = 'none';
    } else {
        // Text mode with dimming
        
        // Remove full-image class
        heroSection.classList.remove('full-image');
        
        // Apply background with dimming gradient
        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${heroImagePath}')`;
        
        // Ensure text elements are visible
        if (heroTitle) {
            heroTitle.style.display = '';
            heroTitle.textContent = `Explore Our ${siteConfig.terminology.productPluralTerm}`;
        }
        
        if (heroDescription) {
            heroDescription.style.display = '';
            heroDescription.textContent = siteConfig.site.tagline;
        }
    }
}

function updateFilterButtons() {
   const siteConfig = window.siteConfig;
   const filterSection = document.querySelector('.filter-section');
   
   // Clear existing buttons
   filterSection.innerHTML = '';
   
   // Add the "All" button
   const allButton = document.createElement('button');
   allButton.className = 'filter-button active';
   allButton.setAttribute('data-filter', 'all');
   allButton.textContent = `All ${siteConfig.terminology.productPluralTerm}`;
   filterSection.appendChild(allButton);
   
   // Add category buttons
   const category1Button = document.createElement('button');
   category1Button.className = 'filter-button';
   category1Button.setAttribute('data-filter', 'category1');
   category1Button.textContent = siteConfig.terminology.category1;
   filterSection.appendChild(category1Button);
   
   const category2Button = document.createElement('button');
   category2Button.className = 'filter-button';
   category2Button.setAttribute('data-filter', 'category2');
   category2Button.textContent = siteConfig.terminology.category2;
   filterSection.appendChild(category2Button);
   
   const category3Button = document.createElement('button');
   category3Button.className = 'filter-button';
   category3Button.setAttribute('data-filter', 'category3');
   category3Button.textContent = siteConfig.terminology.category3;
   filterSection.appendChild(category3Button);
   
   // Set up filter button event listeners
   setupFilterButtons();
}

// Apply custom styles from config
function applyCustomStyles() {
    // Get siteConfig safely with fallback
    const siteConfig = window.siteConfig || {};
    
    // Get or create the dynamic styles element
    let dynamicStyles = document.getElementById('dynamic-styles');
    if (!dynamicStyles) {
        dynamicStyles = document.createElement('style');
        dynamicStyles.id = 'dynamic-styles';
        document.head.appendChild(dynamicStyles);
    }
    
    // First, handle the primary background image (full screen, fixed position)
    if (siteConfig.background && siteConfig.background.image) {
        const bgImage = siteConfig.background.image;
        const bgPath = bgImage.startsWith('http') ? bgImage : `img/${bgImage}`;
        
        // Add a fixed, full-screen background image
        const bgStyle = document.createElement('style');
		bgStyle.textContent = `
			body::before {
				content: '';
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: url('${bgPath}');
				background-size: 100% auto;  // Fill width, maintain aspect ratio
				background-position: top center;  // Align to top
				background-attachment: fixed;
				z-index: -10;
				pointer-events: none;
			}
		`;
        document.head.appendChild(bgStyle);
    }

    // Then, handle the texture pattern (tiled background)
    if (siteConfig.background && siteConfig.background.sectionImage) {
        const sectionImage = siteConfig.background.sectionImage;
        const sectionPath = sectionImage.startsWith('http') ? sectionImage : `img/${sectionImage}`;
        
        // Add a tiled texture pattern
        const textureStyle = document.createElement('style');
		textureStyle.textContent = `
			body::after {
				content: '';
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: url('${sectionPath}');
				background-repeat: repeat;
				opacity: 0.5;  // Increased from 0.15 for visibility
				z-index: -15;  // Lower than the main image (-10)
				pointer-events: none;
			}
		`;
        document.head.appendChild(textureStyle);
    }
    
    // Base CSS variables and other styles
    dynamicStyles.textContent = `
        :root {
            --primary-color: ${siteConfig.colors?.primary || '#003B6F'};
            --secondary-color: ${siteConfig.colors?.secondary || '#00FF9F'};
            --tertiary-color: ${siteConfig.colors?.tertiary || '#6A0DAD'};
            --highlight-color: ${siteConfig.colors?.highlight || '#FFD700'};
            --alert-color: ${siteConfig.colors?.alert || '#FF5722'};
            --background-color: ${siteConfig.colors?.background || '#0A0E17'};
            --text-color: ${siteConfig.colors?.text || '#FFFFFF'};
            
            --font-heading: ${siteConfig.fonts?.heading || "'Orbitron', sans-serif"};
            --font-body: ${siteConfig.fonts?.body || "'Exo 2', sans-serif"};
        }
        
        /* Rest of your styles unchanged */
        .modal-thumbnail-gallery {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .modal-thumbnail {
            width: 70px;
            height: 70px;
            border: 2px solid var(--primary-color);
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s;
        }
        
        .modal-thumbnail:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        
        .modal-thumbnail.active {
            opacity: 1;
            border-color: var(--secondary-color);
            box-shadow: 0 0 10px var(--secondary-color);
        }
        
        .modal-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Digital product styles */
        .digital-access-btn {
            background: linear-gradient(45deg, var(--primary-color), var(--tertiary-color));
            border: none;
            color: var(--text-color);
            font-weight: bold;
            letter-spacing: 1px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .digital-access-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            background: linear-gradient(45deg, var(--tertiary-color), var(--primary-color));
        }
        
        .digital-access-info {
            font-size: 0.9rem;
            color: var(--text-color);
            text-align: center;
        }
        
        .download-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
        }
        
        /* Fix for modal size */
        .modal-content {
            max-height: 90vh;
            overflow-y: auto;
            padding-bottom: 20px;
        }
    `;
}

function initializeStrainTree() {
    console.log("Initializing strain tree...");
    
    // Get strainTree config and explicitly log its value to debug
    const strainTreeEnabled = window.siteConfig?.strainTree?.enabled;
    console.log("Strain tree enabled value:", strainTreeEnabled, "type:", typeof strainTreeEnabled);
    
    // Check if strain tree is enabled in config - FIXED to work with all value types
    // This will handle both boolean false and string "false"
    if (strainTreeEnabled === false || strainTreeEnabled === "false" || !strainTreeEnabled) {
        console.log("Strain tree is disabled, not displaying");
        
        // Hide the strain tree section
        const treeSection = document.getElementById('strain-tree-section');
        if (treeSection) {
            treeSection.style.display = 'none';
        }
        return;
    }
    
    // Get the strain tree section
    const treeSection = document.getElementById('strain-tree-section');
    if (!treeSection) {
        console.error('Strain tree section not found in the DOM');
        return;
    }
    
    // Show the section
    treeSection.style.display = 'block';
    
    // Set title and description from config
    const titleEl = document.getElementById('strain-tree-title');
    const descriptionEl = document.getElementById('strain-tree-description');
    
    if (titleEl && window.siteConfig.strainTree.title) {
        titleEl.textContent = window.siteConfig.strainTree.title;
    }
    
    if (descriptionEl && window.siteConfig.strainTree.description) {
        descriptionEl.textContent = window.siteConfig.strainTree.description;
    }
    
    // Initialize tree visualization if GeneticsTreeVisualizer is available
    if (typeof GeneticsTreeVisualizer === 'function') {
        const strainDataPath = window.siteConfig.strainTree.dataPath || 'data/straindata.json';
        
        try {
            window.strainVisualizer = new GeneticsTreeVisualizer({
                treeElementId: 'genetics-tree',
                strainDescriptionId: 'strain-description',
                expandAllId: 'expand-all',
                collapseAllId: 'collapse-all',
                dataUrl: strainDataPath
            });
        } catch (error) {
            console.error('Error initializing strain tree:', error);
            document.getElementById('genetics-tree').innerHTML = 
                '<p class="error-message">Error initializing strain tree visualization.</p>';
        }
    } else {
        console.error('GeneticsTreeVisualizer not found. Make sure navigator.js is loaded.');
        document.getElementById('genetics-tree').innerHTML = 
            '<p class="error-message">Strain tree visualizer not loaded properly.</p>';
    }
}

// Initialize visual effects
function initializeEffects() {
    const siteConfig = window.siteConfig;
    
    // Background effect
    if (siteConfig.effects && siteConfig.effects.backgroundEffect && siteConfig.effects.backgroundEffect.enabled) {
        loadScript(`effects/${siteConfig.effects.backgroundEffect.type}.js`, function() {
            if (typeof initBackgroundEffect === 'function') {
                initBackgroundEffect(siteConfig.effects.backgroundEffect.intensity);
            }
        });
    }
    
    // Special feature
    if (siteConfig.effects && siteConfig.effects.specialFeature && siteConfig.effects.specialFeature.enabled) {
        loadScript(`effects/${siteConfig.effects.specialFeature.type}.js`, function() {
            if (typeof initSpecialFeature === 'function') {
                const options = {
                    image: siteConfig.effects.specialFeature.image,
                    behavior: siteConfig.effects.specialFeature.behavior
                };
                initSpecialFeature(options);
            }
        });
    }
}

// Helper function to load scripts dynamically
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
        console.warn(`Failed to load script: ${src}`);
        // Just log the error without trying to load from a remote repository
        if (callback) {
            // Call the callback anyway so the site continues to function
            callback();
        }
    };
    document.head.appendChild(script);
}

// Initialize cart
function initializeCart() {
    const siteConfig = window.siteConfig;
    let cart = [];
    
    // Check if shopping is enabled
    const shopEnabled = siteConfig.advanced && siteConfig.advanced.enableShop !== false;
    
    // Only proceed with cart initialization if shopping is enabled
    if (shopEnabled) {
        // Check if local storage is enabled in config
        if (siteConfig.advanced && siteConfig.advanced.enableLocalStorage) {
            const storedCart = localStorage.getItem('siteCart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
            }
        }
        
        // Update cart count
        updateCartCount(cart);
        
        // Store cart in window for access in other functions
        window.siteCart = cart;
    } else {
        // Still initialize empty cart for consistency
        window.siteCart = cart;
    }
}

// Update cart count display
function updateCartCount(cart) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) { // Check if the element exists before updating
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
    }
}

function loadProductsFromLocalStorage() {
    // First check if products are in the config
    if (window.siteConfig && window.siteConfig.products && window.siteConfig.products.items) {
        window.products = window.siteConfig.products.items;
        return true;
    }
    
    // If not in config, try localStorage
    const savedProducts = localStorage.getItem('siteProducts');
    
    if (savedProducts) {
        window.products = JSON.parse(savedProducts);
        return true;
    }
    
    return false;
}

// FUNCTION 1: Main controller - replaces your current initializeFriendLinks()
function initializeFriendLinks() {
    const config = window.siteConfig;
    
    // Handle partner showcase section (NEW visual section)
    if (config.friendLinksShowcase && config.friendLinksShowcase.enabled) {
        initializePartnerShowcase();
    }
    
    // Handle footer friend links (EXISTING text links)
    if (config.showFooterFriendLinks !== false) { // Default to true if not set
        initializeFooterFriendLinks();
    } else {
        // Hide footer friend section if disabled
        const friendSection = document.querySelector('#friend-links-display').closest('.footer-section');
        if (friendSection) {
            friendSection.style.display = 'none';
        }
    }
}

// FUNCTION 2: Your existing footer links - exactly what you have now
function initializeFooterFriendLinks() {
    const friendLinksContainer = document.getElementById('friend-links-display');
    if (!friendLinksContainer) return;
    
    // Clear existing content
    friendLinksContainer.innerHTML = '';
    
    // Check if friendLinks exist in the config
    if (window.siteConfig && window.siteConfig.friendLinks && window.siteConfig.friendLinks.length > 0) {
        // Create list items for each friend link
        window.siteConfig.friendLinks.forEach(link => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            
            anchor.href = link.url;
            anchor.textContent = link.name;
            
            // If it's an external link, open in new tab
            if (link.url.startsWith('http')) {
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
            }
            
            listItem.appendChild(anchor);
            friendLinksContainer.appendChild(listItem);
        });
    } else {
        // Hide the section if no friend links exist
        const friendSection = friendLinksContainer.closest('.footer-section');
        if (friendSection) {
            friendSection.style.display = 'none';
        }
    }
}

// FUNCTION 3: NEW visual partner showcase
function initializePartnerShowcase() {
    const config = window.siteConfig;
    const showcaseSection = document.getElementById('partner-showcase');
    const showcaseContent = document.getElementById('partner-showcase-content');
    
    if (!showcaseSection || !showcaseContent) return;
    
    // Show the section
    showcaseSection.style.display = 'block';
    
    // Set title
    const titleEl = document.getElementById('partner-showcase-title');
    if (titleEl && config.friendLinksShowcase.title) {
        titleEl.textContent = config.friendLinksShowcase.title;
    }
    
    // Generate content based on style
    const style = config.friendLinksShowcase.style || 'cards';
    const friendLinks = config.friendLinks || [];
    
    // Filter links that have images for visual styles
    const visualLinks = friendLinks.filter(link => link.image);
    const linksToShow = visualLinks.length > 0 ? visualLinks : friendLinks;
    
    switch (style) {
        case 'cards':
            showcaseContent.innerHTML = generateCardsHTML(linksToShow);
            break;
        case 'logos':
            showcaseContent.innerHTML = generateLogosHTML(linksToShow);
            break;
        case 'banner':
            showcaseContent.innerHTML = generateBannerHTML(linksToShow);
            break;
        case 'grid':
            showcaseContent.innerHTML = generateGridHTML(linksToShow);
            break;
    }
}

// HELPER FUNCTIONS for the visual styles
function generateCardsHTML(links) {
   const cardsHTML = links.map(link => {
       let imagePath;
       if (link.image) {
           if (link.image.startsWith('http')) {
               imagePath = link.image; // Full URL
           } else if (link.image.includes('/')) {
               imagePath = link.image; // Already has path
           } else {
               imagePath = `img/friends/${link.image}`; // Just filename - add path
           }
       } else {
           imagePath = 'https://via.placeholder.com/280x200/00FF9F/FFFFFF?text=' + link.name.charAt(0);
       }
       
       const description = link.description || '';
       
       return `
           <div class="partner-card">
               <a href="${link.url}" target="_blank" style="text-decoration: none; color: inherit;">
                   <div class="partner-card-image" style="background-image: url('${imagePath}');"></div>
                   <div class="partner-card-text">
                       <div class="partner-name">${link.name}</div>
                       ${description ? `<div class="partner-description">${description}</div>` : ''}
                   </div>
               </a>
           </div>
       `;
   }).join('');
   
   return `<div class="partners-cards">${cardsHTML}</div>`;
}

function generateLogosHTML(links) {
    const logosHTML = links.map(link => {
        const imagePath = link.image ? (link.image.startsWith('http') ? link.image : `img/${link.image}`) : 'https://via.placeholder.com/120x60/00FF9F/FFFFFF?text=' + link.name;
        
        return `
            <a href="${link.url}" class="partner-logo-link" target="_blank">
                <img src="${imagePath}" alt="${link.name}" class="partner-logo-small">
            </a>
        `;
    }).join('');
    
    return `<div class="partners-logos">${logosHTML}</div>`;
}

function generateBannerHTML(links) {
    const bannerHTML = links.map(link => {
        const imagePath = link.image ? (link.image.startsWith('http') ? link.image : `img/${link.image}`) : 'https://via.placeholder.com/150x50/00FF9F/FFFFFF?text=' + link.name;
        
        return `
            <a href="${link.url}" class="partner-banner-item" target="_blank">
                <img src="${imagePath}" alt="${link.name}" class="partner-banner-logo">
            </a>
        `;
    }).join('');
    
    // Duplicate for seamless loop
    const duplicatedHTML = bannerHTML + bannerHTML;
    
    return `
        <div class="partners-banner">
            <div class="partners-slider">
                ${duplicatedHTML}
            </div>
        </div>
    `;
}

function generateGridHTML(links) {
    const gridHTML = links.map(link => {
        const imagePath = link.image ? (link.image.startsWith('http') ? link.image : `img/${link.image}`) : 'https://via.placeholder.com/60x60/00FF9F/FFFFFF?text=' + link.name.charAt(0);
        
        return `
            <a href="${link.url}" class="partner-grid-item" target="_blank">
                <img src="${imagePath}" alt="${link.name}" class="partner-grid-logo">
                <div class="partner-grid-name">${link.name}</div>
            </a>
        `;
    }).join('');
    
    return `<div class="partners-grid">${gridHTML}</div>`;
}

function renderProductCards() {
    const siteConfig = window.siteConfig;
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    // Check if we're in preview mode
    const isPreviewMode = window.location.search.includes('preview=true');
    
    // Define source priority depending on mode
    let products = null;
    
    if (isPreviewMode) {
        // In preview mode, only use products from config
        console.log('Using products from config (preview mode)');
        if (siteConfig && siteConfig.products && siteConfig.products.items) {
            products = siteConfig.products.items;
            console.log('Found', Object.keys(products).length, 'products in config');
        }
    } else {
        // Normal mode - use window.products (which may include realtime inventory)
        if (window.products && Object.keys(window.products).length > 0) {
            products = window.products;
            console.log('Using merged products from window.products');
        } else if (siteConfig && siteConfig.products && siteConfig.products.items) {
            products = siteConfig.products.items;
            console.log('Using products from config');
        }
    }
    
    // Check if we have any products to display
    if (!products || Object.keys(products).length === 0) {
        console.log('No product data found in any source');
        productGrid.innerHTML = `<div class="no-products-message">No ${siteConfig.terminology.productPluralTerm} found. Add some products in the configuration tool.</div>`;
        return;
    }
    
    console.log('Rendering', Object.keys(products).length, 'products');
    
    // Create card for each product
    Object.values(products).forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

function renderProductCards() {
    const siteConfig = window.siteConfig;
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    // Check if we're in preview mode
    const isPreviewMode = window.location.search.includes('preview=true');
    
    // Define source priority depending on mode
    let products = null;
    
    if (isPreviewMode) {
        // In preview mode, only use products from config
        console.log('Using products from config (preview mode)');
        if (siteConfig && siteConfig.products && siteConfig.products.items) {
            products = siteConfig.products.items;
            console.log('Found', Object.keys(products).length, 'products in config');
        }
    } else {
        // Normal mode - use window.products (which may include realtime inventory)
        if (window.products && Object.keys(window.products).length > 0) {
            products = window.products;
            console.log('Using merged products from window.products');
        } else if (siteConfig && siteConfig.products && siteConfig.products.items) {
            products = siteConfig.products.items;
            console.log('Using products from config');
        }
    }
    
    // Check if we have any products to display
    if (!products || Object.keys(products).length === 0) {
        console.log('No product data found in any source');
        productGrid.innerHTML = `<div class="no-products-message">No ${siteConfig.terminology.productPluralTerm} found. Add some products in the configuration tool.</div>`;
        return;
    }
    
    // Convert to array for sorting and filtering
    let productsArray = Object.values(products);
    
    // Filter out hidden products
    productsArray = productsArray.filter(product => !product.hidden);
    
    // Sort by displayOrder if it exists
    productsArray.sort((a, b) => {
        // Default to end of list if displayOrder is not set
        const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
        const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
        return orderA - orderB;
    });
    
    console.log('Rendering', productsArray.length, 'visible products');
    
    // Create card for each product
    productsArray.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

// Function to create product card element
function createProductCard(product) {
    const siteConfig = window.siteConfig;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product', product.id);
    
    // Add delivery type attribute for styling
    if (product.delivery === 'digital') {
        card.setAttribute('data-delivery', 'digital');
    }
    
    // Match product type to category
    let categoryClass = 'category3'; // Default
    
    if (product.type === siteConfig.terminology.category1) {
        categoryClass = 'category1';
    } else if (product.type === siteConfig.terminology.category2) {
        categoryClass = 'category2';
    } else if (product.type === siteConfig.terminology.category3) {
        categoryClass = 'category3';
    }
    
    card.setAttribute('data-category', categoryClass);

    // Handle hover image functionality if product has additional images
    if (product.enableHoverImage && product.additionalImages && product.additionalImages.length > 0) {
        // Get the hover image (or default to first additional image)
        let hoverImagePath = product.hoverImage || product.additionalImages[0];
        
        // Add img/ prefix if needed
        if (hoverImagePath && !hoverImagePath.startsWith('img/') && !hoverImagePath.startsWith('/') && !hoverImagePath.startsWith('http')) {
            hoverImagePath = 'img/' + hoverImagePath;
        }
        
        // Set a custom CSS style for this specific card
        const styleEl = document.createElement('style');
        styleEl.textContent = `.product-card[data-product="${product.id}"]::after { background-image: url("${hoverImagePath}"); }`;
        document.head.appendChild(styleEl);
        
        // Add class to enable hover effect
        card.classList.add('has-hover-image');
    }

    // Add unavailable class for non-available products
    if (product.status !== 'available') {
        card.classList.add('unavailable');
        
        // Add status badge
        const statusBadge = document.createElement('div');
        statusBadge.className = `product-status ${product.status}`;
        
        // Set status text
        if (product.status === 'sold-out') {
            statusBadge.textContent = siteConfig.terminology.soldOutLabel;
        } else if (product.status === 'coming-soon') {
            statusBadge.textContent = siteConfig.terminology.comingSoonLabel;
        }
        
        card.appendChild(statusBadge);
    } else {
        // Add click handler for available products
        card.addEventListener('click', function() {
            openProductModal(product);
        });
    }
    
    // Simply prepend "img/" if needed and let browser handle missing images
    let imagePath = product.image || '';
    if (imagePath && !imagePath.startsWith('img/') && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
        imagePath = 'img/' + imagePath;
    }
    
    // Create the card content
    card.innerHTML += `
        <img src="${imagePath}" alt="${product.name}" class="product-img" onerror="this.style.display='none'">
        <div class="card-content">
            <h3 class="card-title">${product.name}</h3>
            <span class="product-type">${product.type}</span>
            <p class="card-description">${(product.description || '').split('\n')[0]}</p>
            <div class="product-details">
                <div class="detail-item">${product.delivery === 'digital' ? 'Digital' : siteConfig.terminology.productTerm}</div>
                <div class="detail-item">${product.variety || 'Premium'}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Load dummy products if no real data is available
function loadDummyProducts() {
    const siteConfig = window.siteConfig;
    console.log('Loading dummy products...');
    
    // Create dummy product data
    window.products = {
        'product-1': {
            id: 'product-1',
            name: 'Premium Collectible 1',
            type: siteConfig.terminology.category1,
            status: 'available',
            image: 'img/product1.jpg',
            additionalImages: ['img/product1-detail1.jpg'], // Add support for additional images
            description: 'This is a premium collectible with exceptional qualities.',
            variety: 'Premium',
            rating: '4.5/5',
            origin: 'Imported',
            details: 'Detailed information about this premium collectible.',
            notes: 'Special notes about this premium collectible.',
            packOptions: siteConfig.products.defaultPackOptions
        },
        'product-2': {
            id: 'product-2',
            name: 'Signature Collectible 2',
            type: siteConfig.terminology.category2,
            status: 'available',
            image: 'img/product2.jpg',
            additionalImages: [], // Empty array for products without additional images
            description: 'This is a signature collectible with unique characteristics.',
            variety: 'Signature',
            rating: '5/5',
            origin: 'Domestic',
            details: 'Detailed information about this signature collectible.',
            notes: 'Special notes about this signature collectible.',
            packOptions: siteConfig.products.defaultPackOptions
        }
    };
    
    // Now render the dummy products
    renderProductCards();
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    
    document.getElementById('modalTitle').textContent = product.name;
    
    // Fix main image path
    let mainImagePath = product.image;
    if (!mainImagePath) {
        // If main image is empty but there are additional images, use the first one
        if (product.additionalImages && product.additionalImages.length > 0) {
            mainImagePath = product.additionalImages[0];
        } else {
            // Fallback to a placeholder
            mainImagePath = 'img/placeholder.jpg';
        }
    }
    
    // Add img/ prefix if it doesn't exist
    if (mainImagePath && !mainImagePath.startsWith('img/') && !mainImagePath.startsWith('/') && !mainImagePath.startsWith('http')) {
        mainImagePath = 'img/' + mainImagePath;
    }
    
    document.getElementById('modalImage').src = mainImagePath;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalType').textContent = product.type;
    document.getElementById('modalRating').textContent = product.rating || 'N/A';
    document.getElementById('modalOrigin').textContent = product.origin || 'Various';
    document.getElementById('modalRarity').textContent = product.rarity || 'Standard';
    document.getElementById('modalVariety').textContent = product.variety || 'Premium';
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalDetails').textContent = product.details || 'No additional details available.';
    document.getElementById('modalNotes').textContent = product.notes || 'No special notes.';
    
    // Set up thumbnails gallery
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = '';

    // Add these lines to set the alignment directly
    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.style.flexWrap = 'wrap';
    thumbnailsContainer.style.gap = '10px';
    thumbnailsContainer.style.justifyContent = 'flex-start'; // Left alignment
    thumbnailsContainer.style.alignItems = 'center';
    
    // Add main product image as first thumbnail
    const mainThumb = document.createElement('div');
    mainThumb.className = 'modal-thumbnail active';
    mainThumb.innerHTML = `<img src="${mainImagePath}" alt="Main">`;
    mainThumb.addEventListener('click', function() {
        document.getElementById('modalImage').src = mainImagePath;
        document.querySelectorAll('.modal-thumbnail').forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
    });
    thumbnailsContainer.appendChild(mainThumb);
    
    // Add additional images if available - IMPROVED HANDLING
    if (product.additionalImages && product.additionalImages.length > 0) {
        // Filter out empty paths first
        const validAdditionalImages = product.additionalImages.filter(imgSrc => 
            imgSrc && imgSrc.trim() !== ''
        );
        
        validAdditionalImages.forEach((imgSrc, index) => {
            // Fix additional image path
            let additionalImagePath = imgSrc;
            if (additionalImagePath && !additionalImagePath.startsWith('img/') && !additionalImagePath.startsWith('/') && !additionalImagePath.startsWith('http')) {
                additionalImagePath = 'img/' + additionalImagePath;
            }
            
            // Create image element to check if image loads properly
            const imgCheck = new Image();
            imgCheck.onload = function() {
                // Image loaded successfully, add the thumbnail
                const thumb = document.createElement('div');
                thumb.className = 'modal-thumbnail';
                thumb.innerHTML = `<img src="${additionalImagePath}" alt="Image ${index + 1}">`;
                thumb.addEventListener('click', function() {
                    document.getElementById('modalImage').src = additionalImagePath;
                    document.querySelectorAll('.modal-thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    this.classList.add('active');
                });
                thumbnailsContainer.appendChild(thumb);
            };
            imgCheck.onerror = function() {
                // Image failed to load, don't add thumbnail
                console.log(`Image failed to load: ${additionalImagePath}`);
            };
            imgCheck.src = additionalImagePath;
        });
    }
    
    // Set up pack options
    setupPackOptions(product);
    
    // Show modal
    modal.style.display = 'block';
}

// Set up pack options in modal
function setupPackOptions(product) {
    const siteConfig = window.siteConfig;
    const packOptionsContainer = document.getElementById('packOptionButtons');
    packOptionsContainer.innerHTML = '';
    
    // IMPORTANT: This is the key line that needs to change
    // Find the packOptionsTitle element and update its text directly
    const packOptionsTitle = document.getElementById('packOptionsTitle');
    
    // Check if this is a digital product
    if (product.delivery === 'digital' && product.digitalContent) {
        // IMPORTANT: Change title for digital products - this is what was missing
        if (packOptionsTitle) {
            packOptionsTitle.textContent = 'Access Digital Content:';
            packOptionsTitle.style.color = siteConfig.colors.highlight || '#FFD700';
        }
        
        // Create a styled access button for digital content
        const accessButton = document.createElement('button');
        accessButton.className = 'cta-button digital-access-btn';
        accessButton.innerHTML = `<i class="download-icon"></i> Access Digital Content`;
        accessButton.style.width = '100%';
        accessButton.style.marginTop = '10px';
        accessButton.style.padding = '12px 20px';
        accessButton.style.display = 'flex';
        accessButton.style.alignItems = 'center';
        accessButton.style.justifyContent = 'center';
        
        // Add access info text
        const accessInfo = document.createElement('div');
        accessInfo.className = 'digital-access-info';
        accessInfo.innerHTML = `<p>Digital product. Click the button below to access content.</p>`;
        accessInfo.style.marginBottom = '15px';
        accessInfo.style.padding = '10px';
        accessInfo.style.borderRadius = '5px';
        accessInfo.style.backgroundColor = 'rgba(0,0,0,0.1)';
        
        // Add to container
        packOptionsContainer.appendChild(accessInfo);
        packOptionsContainer.appendChild(accessButton);
        
        // Add click handler to open the URL
        accessButton.addEventListener('click', function() {
            // Open the digital content URL in a new tab
            window.open(product.digitalContent, '_blank');
            
            // Close the modal
            document.getElementById('productModal').style.display = 'none';
        });
    } else {
        // For physical products, show pack options as before
        if (packOptionsTitle) {
            packOptionsTitle.textContent = `Select ${siteConfig.terminology.packTerm} Size:`;
            packOptionsTitle.style.color = ''; // Reset any custom color
        }
        
        if (product.packOptions && product.packOptions.length > 0) {
            product.packOptions.forEach(pack => {
                const button = document.createElement('div');
                button.className = 'pack-option-button';
                button.setAttribute('data-pack-id', `${product.id}-${pack.size}`);
                button.innerHTML = `
                    <span class="pack-size">${pack.size}</span>
                    <div class="pack-price">
                        <span class="regular-price">$${pack.regularPrice.toFixed(2)}</span>
                        <span class="sale-price">$${pack.salePrice.toFixed(2)}</span>
                    </div>
                `;
                
                button.addEventListener('click', function() {
                    // Remove 'selected' class from all buttons
                    document.querySelectorAll('.pack-option-button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    // Add 'selected' class to clicked button
                    this.classList.add('selected');
                });
                
                packOptionsContainer.appendChild(button);
            });
            
            // Add to cart button
            const addButton = document.createElement('button');
            addButton.className = 'cta-button';
            addButton.id = 'addToCartBtn';
            addButton.textContent = `Add to ${siteConfig.terminology.cartTerm}`;
            addButton.style.marginTop = '20px';
            addButton.style.width = '100%';
            
            addButton.addEventListener('click', function() {
                const selectedPack = document.querySelector('.pack-option-button.selected');
                
                if (!selectedPack) {
                    alert(`Please select a ${siteConfig.terminology.packTerm} size`);
                    return;
                }
                
                const packId = selectedPack.getAttribute('data-pack-id');
                addPackToCart(packId, product);
            });
            
            packOptionsContainer.appendChild(addButton);
            
            // Select the first option by default
            if (packOptionsContainer.querySelector('.pack-option-button')) {
                packOptionsContainer.querySelector('.pack-option-button').classList.add('selected');
            }
        }
    }
}

// Add pack to cart
function addPackToCart(packId, product) {
    const siteConfig = window.siteConfig;
    const packSizeStr = packId.replace(`${product.id}-`, '');
    const packOption = product.packOptions.find(pack => pack.size === packSizeStr);
    
    if (!packOption) {
        console.error('Pack option not found:', packId);
        return;
    }
    
    // Get correct image path, but store it without the img/ prefix
    let imagePath = product.image;
    if (!imagePath && product.additionalImages && product.additionalImages.length > 0) {
        imagePath = product.additionalImages[0];
    }
    
    // Remove img/ prefix if it exists
    if (imagePath && imagePath.startsWith('img/')) {
        imagePath = imagePath.substring(4);
    }
    
    // Define the item to add to cart
    const cartItem = {
        id: packId,
        productId: product.id,
        name: `${product.name} - ${packOption.size}`,
        image: imagePath,
        price: packOption.salePrice,
        regularPrice: packOption.regularPrice,
        type: product.type,
        quantity: 1
    };
    
    // Get cart from window
    const cart = window.siteCart || [];
    
    // Check if this exact pack is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === packId);
    
    if (existingItemIndex !== -1) {
        // Increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(cartItem);
    }
    
    // Save cart
    window.siteCart = cart;
    
    // Save to localStorage if enabled
    if (siteConfig.advanced && siteConfig.advanced.enableLocalStorage) {
        localStorage.setItem('siteCart', JSON.stringify(cart));
    }
    
    // Update cart count
    updateCartCount(cart);
    
    // Close modal
    document.getElementById('productModal').style.display = 'none';
    
    // Show cart modal
    openCartModal();
}

// Open cart modal
function openCartModal() {
    const siteConfig = window.siteConfig;
    const cart = window.siteCart || [];
    
    // Clear cart items
    const cartItemsEl = document.getElementById('cartItems');
    cartItemsEl.innerHTML = '';
    
    // Show/hide empty cart message
    const cartEmptyEl = document.getElementById('cartEmpty');
    const cartTotalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartEmptyEl.style.display = 'block';
        cartTotalEl.style.display = 'none';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
    } else {
        cartEmptyEl.style.display = 'none';
        cartTotalEl.style.display = 'flex';
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        
        // Add cart items
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            
            // Fix image path handling
            let imagePath = item.image;
            if (imagePath && !imagePath.startsWith('img/') && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
                imagePath = 'img/' + imagePath;
            }
            
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${imagePath}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-type">${item.type || ''}</div>
                </div>
                <div class="quantity-selector">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <button class="cart-item-remove" data-index="${index}">&times;</button>
            `;
            
            cartItemsEl.appendChild(cartItemEl);
        });
        
        // Update total
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    }
    
    // Show cart modal
    document.getElementById('cartModal').style.display = 'block';
}

// Filter buttons
// Filter buttons
function setupFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            const siteConfig = window.siteConfig;
            
            // Show/hide product cards based on filter
            document.querySelectorAll('.product-card').forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    // Get the category attribute directly
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}
	
// Set up event listeners
function setupEventListeners() {
    // Cart link
    const cartLink = document.getElementById('cart-link');
    
    // Check if shopping cart is enabled
    const shopEnabled = window.siteConfig.advanced && window.siteConfig.advanced.enableShop !== false;
    
    if (cartLink && shopEnabled) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }
    
    // Close modals on X click
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

	document.querySelectorAll('.close-about').forEach(closeBtn => {
		closeBtn.addEventListener('click', function() {
			// Hide the about section
			document.getElementById('about').style.display = 'none';
			
			// Show the main content sections again
			document.getElementById('products').style.display = 'block';
			document.querySelector('.filter-section').style.display = 'flex';
			
			// Restore the strain tree section if it should be visible
			const strainTreeSection = document.getElementById('strain-tree-section');
			if (strainTreeSection && window.siteConfig?.strainTree?.enabled === true) {
				strainTreeSection.style.display = 'block';
			}
			
			// Restore the partner showcase section if it should be visible
			const partnerSection = document.getElementById('partner-showcase');
			if (partnerSection && window.siteConfig?.friendLinksShowcase?.enabled === true) {
				partnerSection.style.display = 'block';
			}
			
			// Ensure the "All" filter is active to show all products
			document.querySelectorAll('.filter-button').forEach(btn => {
				btn.classList.remove('active');
			});
			document.querySelector('.filter-button[data-filter="all"]').classList.add('active');
			
			// Restore all product cards to visible
			document.querySelectorAll('.product-card').forEach(card => {
				card.style.display = 'block';
			});
		});
	});
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            document.getElementById('cartModal').style.display = 'none';
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = window.siteCart || [];
            if (cart.length > 0) {
                document.getElementById('cartModal').style.display = 'none';
                document.getElementById('checkoutModal').style.display = 'block';
            }
        });
    }

    // Add this section to handle About link clicks
    document.querySelectorAll('a[href="#about"]').forEach(aboutLink => {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide any open modals
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            // Show the about section
            const aboutSection = document.getElementById('about');
            aboutSection.style.display = 'block';
            
            // Scroll to the about section
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Modal tabs
    document.querySelectorAll('.info-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.info-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.info-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Prepare order details
            let orderDetails = `Order Items:\n\n`;
            let total = 0;
            
            const cart = window.siteCart || [];
            cart.forEach(item => {
                const itemTotal = item.quantity * item.price;
                total += itemTotal;
                
                orderDetails += `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)} each): $${itemTotal.toFixed(2)}\n`;
            });
            
            orderDetails += `\nTotal: $${total.toFixed(2)}`;
            
            // Handle checkout based on config
            const siteConfig = window.siteConfig;
            if (siteConfig.advanced.checkoutMethod === 'email') {
                // Email checkout
                handleEmailCheckout(name, email, phone, message, orderDetails);
            } else if (siteConfig.advanced.checkoutMethod === 'form') {
                // Form submission
                alert('Form checkout not implemented yet');
            } else if (siteConfig.advanced.checkoutMethod === 'external') {
                // External checkout
                if (siteConfig.advanced.externalCheckoutUrl) {
                    window.location.href = siteConfig.advanced.externalCheckoutUrl;
                } else {
                    alert('External checkout URL not configured');
                }
            }
        });
    }
    
    // Set up cart item event listeners
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            const cart = window.siteCart || [];
            
            // Decrease quantity
            if (e.target.classList.contains('decrease')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    saveAndUpdateCart(cart);
                    openCartModal(); // Refresh cart modal
                }
            }
            
            // Increase quantity
            if (e.target.classList.contains('increase')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart[index].quantity += 1;
                saveAndUpdateCart(cart);
                openCartModal(); // Refresh cart modal
            }
            
            // Remove item
            if (e.target.classList.contains('cart-item-remove')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                saveAndUpdateCart(cart);
                openCartModal(); // Refresh cart modal
            }
        });
    }
}

// Handle email checkout
function handleEmailCheckout(name, email, phone, message, orderDetails) {
    const siteConfig = window.siteConfig;
    
    // Use order email if available, otherwise fall back to contact email
    const orderEmail = siteConfig.advanced.orderEmail || siteConfig.site.email;
    
    // Prepare email body
    let emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}

`;
    
    // Prepare digital product info
    const cart = window.siteCart || [];
    let hasDigitalProducts = false;
    let digitalProductLinks = '';
    
    cart.forEach(item => {
        // Check if this is a digital product
        const product = window.products ? window.products[item.productId] : null;
        if (product && product.delivery === 'digital' && product.digitalContent) {
            hasDigitalProducts = true;
            digitalProductLinks += `\n${item.name}: ${product.digitalContent}`;
        }
    });
    
    // Add order details
    emailBody += orderDetails;
    
    // Add digital product links if any
    if (hasDigitalProducts) {
        emailBody += `\n\n--- DIGITAL PRODUCT LINKS ---\n${digitalProductLinks}\n`;
    }
    
    // Add additional notes
    emailBody += `\nAdditional Notes:\n${message}`;
    
    // Create mailto link
    const mailtoLink = `mailto:${orderEmail}?subject=New Order from ${name}&body=${encodeURIComponent(emailBody)}`;
    
    // Display digital products if any
    if (hasDigitalProducts) {
        const digitalLinkDisplay = document.createElement('div');
        digitalLinkDisplay.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--background-color); border: 2px solid var(--secondary-color); border-radius: 10px; padding: 20px; max-width: 600px; width: 90%; z-index: 1100; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);';
        
        const linksList = digitalProductLinks.split('\n')
            .filter(link => link.trim())
            .map(link => {
                const parts = link.split(': ');
                if (parts.length < 2) return '';
                
                // Improved styling for digital links
                return `<li style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                    <strong style="display: block; margin-bottom: 5px; color: var(--secondary-color);">${parts[0]}</strong>
                    <a href="${parts[1]}" target="_blank" style="color: var(--highlight-color); word-break: break-all; display: inline-block;">${parts[1]}</a>
                </li>`;
            }).join('');
        
        digitalLinkDisplay.innerHTML = `
            <h3 style="font-family: var(--font-heading); color: var(--secondary-color); margin-bottom: 15px; text-align: center;">Your Digital Products</h3>
            <p style="margin-bottom: 15px;">Here are your digital products. You can access them immediately:</p>
            <ul style="margin: 15px 0 25px 0; list-style-type: none; padding: 0;">
                ${linksList}
            </ul>
            <p style="margin-bottom: 20px; font-size: 0.9em; color: var(--text-color); opacity: 0.8;">These links have also been included in your order email.</p>
            <div style="display: flex; justify-content: center;">
                <button id="digital-links-close" style="background: var(--primary-color); color: var(--text-color); border: none; padding: 10px 25px; border-radius: 5px; cursor: pointer; transition: all 0.3s; font-family: var(--font-heading);">Continue</button>
            </div>
        `;
        
        document.body.appendChild(digitalLinkDisplay);
        
        // Add close button event
        document.getElementById('digital-links-close').addEventListener('click', function() {
            document.body.removeChild(digitalLinkDisplay);
            
            // Proceed with email client opening
            window.location.href = mailtoLink;
            
            // Clear cart
            window.siteCart = [];
            if (siteConfig.advanced && siteConfig.advanced.enableLocalStorage) {
                localStorage.setItem('siteCart', JSON.stringify([]));
            }
            updateCartCount([]);
            
            // Close checkout modal
            document.getElementById('checkoutModal').style.display = 'none';
            
            // Show thank you message
            alert('Thank you for your order! Your email client has been opened with your order details. Please send the email to complete your order.');
        });
    } else {
        // If no digital products, proceed with regular email checkout
        window.location.href = mailtoLink;
        
        // Clear cart
        window.siteCart = [];
        if (siteConfig.advanced && siteConfig.advanced.enableLocalStorage) {
            localStorage.setItem('siteCart', JSON.stringify([]));
        }
        updateCartCount([]);
        
        // Close checkout modal
        document.getElementById('checkoutModal').style.display = 'none';
        
        // Show thank you message
        alert('Thank you for your order! Your email client has been opened with your order details. Please send the email to complete your order.');
    }
}

// Helper function to save cart and update count
function saveAndUpdateCart(cart) {
    const siteConfig = window.siteConfig;
    window.siteCart = cart;
    if (siteConfig.advanced && siteConfig.advanced.enableLocalStorage) {
        localStorage.setItem('siteCart', JSON.stringify(cart));
    }
    updateCartCount(cart);
}