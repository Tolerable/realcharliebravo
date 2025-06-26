// Replace your js/agecheck.js with this simple version

console.log('Age check script started');

// Use a UNIQUE key that no existing user could have
const AGE_VERIFICATION_KEY = 'ageVerified_v2_2025'; // Unique key for this deployment

// Check if already verified with the NEW key
if (localStorage.getItem(AGE_VERIFICATION_KEY) === 'true') {
    console.log('User already age verified, skipping modal');
} else {
    console.log('User not verified with new system, showing age check modal');
    
    // Get configuration values (with defaults)
    const siteConfig = window.siteConfig || {};
    const advanced = siteConfig.advanced || {};
    const minimumAge = advanced.ageCheckMinimum || 21;
    const redirectUrl = advanced.ageRedirectUrl || 'https://www.google.com';
    
    // Create modal immediately
    createAgeModal(minimumAge, redirectUrl);
}

function createAgeModal(minimumAge, redirectUrl) {
    // Remove any existing modal first
    const existingModal = document.getElementById('ageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'ageModal';
    modal.className = 'age-verification-modal';
    
    modal.innerHTML = `
        <div class="age-modal-content">
            <div class="age-header">
                <h2>Age Verification Required</h2>
            </div>
            <div class="age-body">
                <p>You must be ${minimumAge} years or older to enter this site.</p>
                <p>Please read carefully and select the appropriate option:</p>
                <div class="age-buttons">
                    <button onclick="window.verifyAge(false)" class="age-no-disguised">
                        <span class="btn-text">I am NOT ${minimumAge}+ years old</span>
                    </button>
                    <button onclick="window.verifyAge(true)" class="age-yes-disguised">
                        <span class="btn-text">I am ${minimumAge}+ years old</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    if (!document.getElementById('age-verification-styles')) {
        const style = document.createElement('style');
        style.id = 'age-verification-styles';
        style.textContent = `
            .age-verification-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.95);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }
            
            .age-modal-content {
                background: linear-gradient(135deg, #1e2b20, #2a3f2c);
                border: 2px solid #3a7d44;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                padding: 30px;
                text-align: center;
                color: #f2f7f3;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes modalSlideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
            }
            
            .age-header h2 {
                margin-top: 0;
                color: #f9c74f;
                font-size: 1.8rem;
                font-family: 'Orbitron', sans-serif;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .age-body p {
                font-size: 1.1rem;
                margin-bottom: 15px;
                line-height: 1.5;
            }
            
            .age-buttons {
                margin: 25px 0;
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-direction: column;
            }
            
            .age-buttons button {
                padding: 15px 20px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                position: relative;
                overflow: hidden;
                font-family: 'Exo 2', sans-serif;
            }
            
            .age-buttons button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(0,0,0,0.3);
            }
            
            .age-no-disguised {
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                border: 2px solid #2E7D32;
            }
            
            .age-no-disguised:hover {
                background: linear-gradient(135deg, #2E7D32, #1B5E20);
            }
            
            .age-yes-disguised {
                background: linear-gradient(135deg, #F44336, #B71C1C);
                color: white;
                border: 2px solid #B71C1C;
            }
            
            .age-yes-disguised:hover {
                background: linear-gradient(135deg, #B71C1C, #8C1A1A);
            }
            
            .btn-text {
                text-transform: uppercase;
                letter-spacing: 1px;
                display: block;
            }
            
            @media (max-width: 600px) {
                .age-modal-content {
                    padding: 20px;
                    margin: 20px;
                }
                
                .age-header h2 {
                    font-size: 1.5rem;
                }
                
                .age-body p {
                    font-size: 1rem;
                }
                
                .age-buttons button {
                    font-size: 1rem;
                    padding: 12px 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    console.log('Age verification modal created and displayed');
}

// Age verification function using the NEW unique key
window.verifyAge = function(isOver21) {
    const siteConfig = window.siteConfig || {};
    const advanced = siteConfig.advanced || {};
    const redirectUrl = advanced.ageRedirectUrl || 'https://www.google.com';
    
    if (isOver21) {
        // Store verification with the NEW unique key
        localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
        
        const modal = document.getElementById('ageModal');
        if (modal) {
            modal.style.animation = 'modalSlideOut 0.3s ease-in';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
        
        console.log('Age verification passed');
    } else {
        console.log('Age verification failed, redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
    }
};