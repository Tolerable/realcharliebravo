// Product Data
// Replace these sample products with your own product data

const products = {
    'product-1': {
        id: 'product-1',
        name: 'Premium Collection Alpha',
        type: 'Premium Collection',
        status: 'available',
        image: 'img/product1.jpg',
        cardImage: 'img/product1-square.jpg',
        rating: '5/5',
        origin: 'Imported',
        rarity: 'Limited Edition',
        variety: 'Premium',
        description: 'This premium collectible features exceptional quality and unique characteristics. Each item is carefully curated to ensure maximum collector satisfaction and long-term value.',
        details: 'Grown in optimal conditions using specialized techniques to enhance natural qualities. Features a balanced profile with multiple desirable attributes that collectors seek.',
        notes: 'Best stored in cool, dark conditions to preserve quality. Each collection may vary slightly due to natural variation, which is part of what makes these collectibles special.',
        images: [
            'img/product1-detail1.jpg',
            'img/product1-detail2.jpg',
            'img/product1-detail3.jpg',
            'img/product1-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 35, salePrice: 30 },
            { size: '5 Pack', regularPrice: 50, salePrice: 45 },
            { size: '10 Pack', regularPrice: 95, salePrice: 80 }
        ]
    },
    'product-2': {
        id: 'product-2',
        name: 'Signature Series Beta',
        type: 'Signature Series',
        status: 'available',
        image: 'img/product2.jpg',
        cardImage: 'img/product2-square.jpg',
        rating: '4.8/5',
        origin: 'Domestic',
        rarity: 'Rare',
        variety: 'Signature',
        description: 'Our signature series features specially selected items with distinctive qualities. This beta edition has been specially developed for collectors who appreciate unique characteristics.',
        details: 'Expertly developed through careful selection and specialized processes. Features a distinctive profile that stands out in any collection.',
        notes: 'This signature collectible exhibits exceptional stability and consistency. Great for both new and experienced collectors looking to expand their portfolio.',
        images: [
            'img/product2-detail1.jpg',
            'img/product2-detail2.jpg',
            'img/product2-detail3.jpg',
            'img/product2-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 40, salePrice: 35 },
            { size: '5 Pack', regularPrice: 60, salePrice: 50 },
            { size: '10 Pack', regularPrice: 110, salePrice: 90 }
        ]
    },
    'product-3': {
        id: 'product-3',
        name: 'Hybrid Collection Gamma',
        type: 'Hybrid Collection',
        status: 'sold-out',
        image: 'img/product3.jpg',
        cardImage: 'img/product3-square.jpg',
        rating: '4.9/5',
        origin: 'Mixed',
        rarity: 'Ultra Rare',
        variety: 'Hybrid',
        description: 'This hybrid collection combines the best qualities from multiple sources to create something truly unique. The gamma variant exhibits exceptional characteristics that serious collectors value.',
        details: 'A carefully balanced blend that takes the best aspects from different varieties. The resulting combination creates a collectible with outstanding versatility and appeal.',
        notes: 'Currently out of stock due to high demand. Will be restocked in limited quantities in the future. Join our mailing list to be notified when available.',
        images: [
            'img/product3-detail1.jpg',
            'img/product3-detail2.jpg',
            'img/product3-detail3.jpg',
            'img/product3-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 45, salePrice: 40 },
            { size: '5 Pack', regularPrice: 70, salePrice: 60 },
            { size: '10 Pack', regularPrice: 120, salePrice: 100 }
        ]
    },
    'product-4': {
        id: 'product-4',
        name: 'Special Reserve Delta',
        type: 'Premium Collection',
        status: 'coming-soon',
        image: 'img/product4.jpg',
        cardImage: 'img/product4-square.jpg',
        rating: 'Unreleased',
        origin: 'Specialty Import',
        rarity: 'Extremely Rare',
        variety: 'Special Reserve',
        description: 'Our most anticipated release yet, the Special Reserve Delta is a truly exceptional addition to any collection. Limited quantities will be available soon.',
        details: 'Details are still under wraps, but early testing suggests this will be one of our most impressive releases to date. Features unique characteristics not found in other collections.',
        notes: 'Launching next month. Pre-orders will be available to newsletter subscribers first. Expected to sell out quickly.',
        images: [
            'img/product4-detail1.jpg',
            'img/product4-detail2.jpg',
            'img/product4-detail3.jpg',
            'img/product4-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 50, salePrice: 45 },
            { size: '5 Pack', regularPrice: 80, salePrice: 70 },
            { size: '10 Pack', regularPrice: 140, salePrice: 120 }
        ]
    },
    'product-5': {
        id: 'product-5',
        name: 'Classic Edition Epsilon',
        type: 'Signature Series',
        status: 'available',
        image: 'img/product5.jpg',
        cardImage: 'img/product5-square.jpg',
        rating: '4.7/5',
        origin: 'Domestic',
        rarity: 'Common',
        variety: 'Classic',
        description: 'A time-tested favorite among collectors, the Classic Edition Epsilon continues to impress with its reliable quality and consistent characteristics.',
        details: 'Simple yet impressive, this signature series staple has earned its reputation through years of consistent performance. Ideal for both beginners and experienced collectors.',
        notes: 'Our most popular item for first-time collectors. Provides an excellent introduction to the world of premium collectibles without overwhelming complexity.',
        images: [
            'img/product5-detail1.jpg',
            'img/product5-detail2.jpg',
            'img/product5-detail3.jpg',
            'img/product5-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 30, salePrice: 25 },
            { size: '5 Pack', regularPrice: 45, salePrice: 40 },
            { size: '10 Pack', regularPrice: 85, salePrice: 70 }
        ]
    },
    'product-6': {
        id: 'product-6',
        name: 'Experimental Zeta',
        type: 'Hybrid Collection',
        status: 'available',
        image: 'img/product6.jpg',
        cardImage: 'img/product6-square.jpg',
        rating: '4.5/5',
        origin: 'Laboratory Developed',
        rarity: 'Uncommon',
        variety: 'Experimental',
        description: 'The Experimental Zeta represents the cutting edge of our hybrid collection. Developed using innovative techniques, this unique collectible pushes boundaries.',
        details: 'Features a revolutionary approach to production that yields distinctive qualities not found in traditional collectibles. Offers a truly novel experience for the discerning collector.',
        notes: 'Limited production run. Each batch varies slightly, making every collection unique. Comes with a certificate of authenticity.',
        images: [
            'img/product6-detail1.jpg',
            'img/product6-detail2.jpg',
            'img/product6-detail3.jpg',
            'img/product6-detail4.jpg'
        ],
        packOptions: [
            { size: '3 Pack', regularPrice: 55, salePrice: 50 },
            { size: '5 Pack', regularPrice: 85, salePrice: 75 },
            { size: '10 Pack', regularPrice: 150, salePrice: 130 }
        ]
    }
};