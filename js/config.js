// Seed Collective - Configuration File
				// Edit this file to customize your site

				window.siteConfig = {
    "site": {
        "name": "REALCHARLIEBRAVO MERC SHOP",
        "tagline": "Unique Collectibles from Around the World",
        "logo": "img/logo.jpg",
        "heroBackground": "img/hero-bg.jpg",
        "socialPreview": "",
        "showHeroText": true,
        "email": "contact@example.com",
        "socialLinks": [
            {
                "name": "Discord",
                "url": "https://discord.gg/yourcollective"
            },
            {
                "name": "YouTube",
                "url": "https://youtube.com/@yourchannel"
            },
            {
                "name": "Instagram",
                "url": "https://instagram.com/yourhandle"
            }
        ],
        "copyright": "© 2025 RealCharlieBravo. All rights reserved."
    },
    "colors": {
        "primary": "#2e7d32",
        "secondary": "#8bc34a",
        "tertiary": "#795548",
        "highlight": "#ffc107",
        "alert": "#f44336",
        "background": "#1b2d1c",
        "text": "#ffffff"
    },
    "background": {
        "image": "",
        "sectionImage": "metal-texture.jpg"
    },
    "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Exo 2', sans-serif"
    },
    "terminology": {
        "category1": "Premium Collection",
        "category2": "Signature Series",
        "category3": "Hybrid Collection",
        "productTerm": "Collectible",
        "productPluralTerm": "Collectibles",
        "packTerm": "Collection Pack",
        "cartTerm": "Collection Box",
        "soldOutLabel": "UNAVAILABLE",
        "comingSoonLabel": "COMING SOON"
    },
    "effects": {
        "backgroundEffect": {
            "enabled": true,
            "type": "stars",
            "intensity": "medium"
        },
        "specialFeature": {
            "enabled": true,
            "type": "floatingObject",
            "image": "img/floating-object.png",
            "behavior": "teleport"
        }
    },
    "strainTree": {
        "enabled": false,
        "title": "Strain Genetics Explorer",
        "description": "Explore the genetic relationships between our strains.",
        "dataPath": "data/straindata.json"
    },
    "legal": {
        "enableDisclaimer": true,
        "disclaimerText": "[Company Name] sells products for souvenir and collectible purposes only. Products may not be legal in some countries and [Company Name] strongly advises you not to take products where they are not permitted. [Company Name] does not accept any responsibility for any violation of customs regulations or local laws. All responsibility falls on the purchaser to determine the legal status of products in their country of residence. Any information provided is for educational purposes only."
    },
    "about": {
        "title": "About Seed Collective",
        "subtitle": "Our Story and Mission",
        "image": "img/about.jpg",
        "description": "Founded in 2024, Seed Collective is dedicated to bringing unique collectibles to enthusiasts around the world. We carefully curate our collections to ensure only the highest quality items reach our customers.",
        "teamMembers": [],
        "historyItems": [],
        "additionalSections": []
    },
    "products": {
        "defaultStatus": "available",
        "enableRatings": true,
        "showPackOptions": true,
        "defaultPackOptions": [
            {
                "size": "3 Pack",
                "regularPrice": 35,
                "salePrice": 30
            },
            {
                "size": "5 Pack",
                "regularPrice": 50,
                "salePrice": 45
            },
            {
                "size": "10 Pack",
                "regularPrice": 95,
                "salePrice": 80
            }
        ],
        "items": {
            "product-1": {
                "id": "product-1",
                "name": "Premium Collectible 1",
                "type": "Premium Collection",
                "status": "available",
                "image": "img/product1.jpg",
                "additionalImages": [],
                "description": "This is a premium collectible with exceptional qualities.",
                "variety": "Premium",
                "rating": "4.5/5",
                "origin": "Imported",
                "details": "Detailed information about this premium collectible.",
                "notes": "Special notes about this premium collectible.",
                "packOptions": [
                    {
                        "size": "3 Pack",
                        "regularPrice": 35,
                        "salePrice": 30
                    },
                    {
                        "size": "5 Pack",
                        "regularPrice": 50,
                        "salePrice": 45
                    }
                ]
            }
        }
    },
    "navigation": [
        {
            "name": "Premium Collections",
            "url": "#products"
        },
        {
            "name": "About",
            "url": "#about"
        },
        {
            "name": "Contact",
            "url": "#contact"
        }
    ],
    "friendLinks": [
        {
            "name": "StrainNavigator",
            "url": "https://www.strainnavigator.com/",
            "image": "img/friends/Strain_Navigator_Logo.jpg",
            "description": "Premium strain database"
        }
    ],
    "friendLinksShowcase": {
        "enabled": false,
        "style": "cards",
        "title": "Friends and Sponsors"
    },
    "showFooterFriendLinks": true,
    "advanced": {
        "enableShop": false,
        "enableLocalStorage": true,
        "checkoutMethod": "email",
        "externalCheckoutUrl": "",
        "analyticsId": "",
        "orderEmail": "orders@example.com",
        "enableAgeCheck": false,
        "ageCheckMinimum": 21,
        "ageRedirectUrl": "https://www.google.com"
    }
};