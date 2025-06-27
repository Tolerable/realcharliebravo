// Google Sheets Integration JavaScript - Add this to your existing script

// Initialize Google Sheets functionality when the DOM is loaded
function initializeGoogleSheetsIntegration() {
    // Set up event listeners
    const loadSheetsBtn = document.getElementById('load-sheets-btn');
    const testSheetsBtn = document.getElementById('test-sheets-btn');
    const saveInventoryBtn = document.getElementById('save-inventory-btn');
    
    if (loadSheetsBtn) {
        loadSheetsBtn.addEventListener('click', loadFromGoogleSheets);
    }
    
    if (testSheetsBtn) {
        testSheetsBtn.addEventListener('click', testGoogleSheetsConnection);
    }
    
    if (saveInventoryBtn) {
        saveInventoryBtn.addEventListener('click', saveInventoryFile);
    }
}

// Test connection to Google Sheets
async function testGoogleSheetsConnection() {
    const sheetsUrl = document.getElementById('sheets-url').value.trim();
    const sheetsTab = document.getElementById('sheets-tab').value.trim();
    
    if (!sheetsUrl) {
        showSheetsStatus('Error', 'Please enter a Google Sheets URL', 'error');
        return;
    }
    
    try {
        showSheetsStatus('Testing Connection...', 'Connecting to Google Sheets...', 'loading');
        
        // Convert Google Sheets URL to CSV export URL
        const csvUrl = convertGoogleSheetsToCsvUrl(sheetsUrl, sheetsTab);
        
        // Fetch CSV data
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const csvData = await response.text();
        if (!csvData || csvData.includes('<!DOCTYPE html>')) {
            throw new Error('Invalid response. Make sure your spreadsheet is published to the web and accessible to anyone with the link.');
        }
        
        // Parse the first few rows to check structure
        const parsedData = parseCSV(csvData);
        
        if (parsedData.length === 0) {
            throw new Error('Spreadsheet appears to be empty');
        }
        
        // Show success and preview first few products
        showSheetsStatus('Connection Successful', `Found ${parsedData.length - 1} products in the spreadsheet.`, 'success');
        previewSheetData(parsedData);
    } catch (error) {
        showSheetsStatus('Connection Failed', `Error: ${error.message}`, 'error');
    }
}

// Load products from Google Sheets
async function loadFromGoogleSheets() {
    const sheetsUrl = document.getElementById('sheets-url').value.trim();
    const sheetsTab = document.getElementById('sheets-tab').value.trim();
    const importOption = document.getElementById('import-option').value;
    
    if (!sheetsUrl) {
        showSheetsStatus('Error', 'Please enter a Google Sheets URL', 'error');
        return;
    }
    
    try {
        showSheetsStatus('Loading...', 'Fetching data from Google Sheets...', 'loading');
        
        // Convert Google Sheets URL to CSV export URL
        const csvUrl = convertGoogleSheetsToCsvUrl(sheetsUrl, sheetsTab);
        
        // Fetch CSV data
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const csvData = await response.text();
        if (!csvData || csvData.includes('<!DOCTYPE html>')) {
            throw new Error('Invalid response. Make sure your spreadsheet is published to the web and accessible to anyone with the link.');
        }
        
        // Parse CSV data
        const parsedData = parseCSV(csvData);
        
        if (parsedData.length <= 1) {
            // Only has header row
            throw new Error('No product data found in the spreadsheet');
        }
        
        // Convert to products
        const products = convertToProducts(parsedData);
        
        // Handle import based on option
        handleProductImport(products, importOption);
        
        // Show success message
        showSheetsStatus('Import Successful', `${products.length} products have been ${importOption === 'replace' ? 'loaded' : importOption === 'merge' ? 'merged' : 'added'}.`, 'success');
        
        // Update product display
        const savedProducts = JSON.parse(localStorage.getItem('siteProducts') || '{}');
        renderProductList(savedProducts);
        
        // Show inventory instructions
        document.getElementById('inventory-instructions').style.display = 'block';
    } catch (error) {
        showSheetsStatus('Import Failed', `Error: ${error.message}`, 'error');
    }
}

// Save inventory to a separate file
function saveInventoryFile() {
    try {
        const savedProducts = JSON.parse(localStorage.getItem('siteProducts') || '{}');
        
        if (Object.keys(savedProducts).length === 0) {
            alert('No products found to save. Please add products or import from Google Sheets first.');
            return;
        }
        
        const inventoryJs = `// Seed Collective - Inventory File
// Generated on ${new Date().toLocaleString()}
// This file contains just the product inventory and can be updated independently
// from your main configuration file (config.js)

window.siteInventory = ${JSON.stringify(savedProducts, null, 2)};

// If this inventory file is loaded after config.js, update the site config
if (window.siteConfig && window.siteConfig.products) {
    window.siteConfig.products.items = window.siteInventory;
    console.log("Inventory loaded and applied to site configuration");
}`;
        
        // Create download link
        const blob = new Blob([inventoryJs], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'inventory.js';
        downloadLink.click();
        
        // Show inventory instructions
        document.getElementById('inventory-instructions').style.display = 'block';
        
        // Clean up
        URL.revokeObjectURL(url);
    } catch (error) {
        alert(`Error saving inventory: ${error.message}`);
    }
}

// Helper Functions

// Convert a Google Sheets URL to a CSV export URL
function convertGoogleSheetsToCsvUrl(sheetsUrl, sheetTab) {
    // Extract the spreadsheet ID from the URL
    let spreadsheetId = '';
    
    // Match Google Sheets URL patterns
    if (sheetsUrl.includes('/spreadsheets/d/')) {
        const match = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            spreadsheetId = match[1];
        }
    } else if (sheetsUrl.includes('key=')) {
        const match = sheetsUrl.match(/key=([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            spreadsheetId = match[1];
        }
    }
    
    if (!spreadsheetId) {
        throw new Error('Invalid Google Sheets URL. Please make sure you copy the URL from your browser address bar.');
    }
    
    // Construct the CSV export URL
    let csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    
    // Add sheet parameter if specified
    if (sheetTab) {
        csvUrl += `&sheet=${encodeURIComponent(sheetTab)}`;
    }
    
    return csvUrl;
}

// Parse CSV data
function parseCSV(csvData) {
    // Split by newlines
    const lines = csvData.split('\n');
    const result = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const row = [];
        let inQuotes = false;
        let currentValue = '';
        
        // Process each character in the line
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        // Add the last field
        row.push(currentValue);
        
        // Remove quotes from values
        for (let j = 0; j < row.length; j++) {
            if (row[j].startsWith('"') && row[j].endsWith('"')) {
                row[j] = row[j].substring(1, row[j].length - 1);
            }
        }
        
        result.push(row);
    }
    
    return result;
}

// Convert parsed data to product objects
// Convert parsed data to product objects - using fixed column positions
function convertToProducts(data) {
    if (data.length < 2) {
        throw new Error('Spreadsheet must have at least a header row and one data row');
    }
    
    // Define fixed column positions (0-based indices)
    const columnPositions = {
        id: 0,           // Column A
        name: 1,         // Column B
        type: 2,         // Column C
        status: 3,       // Column D
        image: 4,        // Column E
        additionalImages: 5, // Column F
        description: 6,  // Column G
        price: 7,        // Column H
        salePrice: 8,    // Column I
        packSize: 9,     // Column J
        variety: 10,     // Column K
        rating: 11,      // Column L
        origin: 12,      // Column M
        notes: 13        // Column N
    };
    
    const products = [];
    
    // Process each data row - SKIP the first row (assumed to be headers)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        // Skip if id is missing
        if (!row[columnPositions.id] || row[columnPositions.id].trim() === '') {
            console.warn(`Skipping row ${i + 1} due to missing ID`);
            continue;
        }
        
        // Create product object using fixed positions
        const product = {
            id: row[columnPositions.id]?.trim(),
            name: row[columnPositions.name]?.trim() || `Product ${i}`,
            type: row[columnPositions.type]?.trim() || 'Premium Collection',
            status: row[columnPositions.status]?.trim() || 'available',
            image: row[columnPositions.image]?.trim() || '',
            additionalImages: [],
            description: row[columnPositions.description]?.trim() || '',
            variety: row[columnPositions.variety]?.trim() || '',
            rating: row[columnPositions.rating]?.trim() || '',
            origin: row[columnPositions.origin]?.trim() || '',
            details: '',
            notes: row[columnPositions.notes]?.trim() || '',
            packOptions: []
        };
        
        // Handle additional images
        if (row[columnPositions.additionalImages]) {
            product.additionalImages = row[columnPositions.additionalImages]
                .split(',')
                .map(img => img.trim())
                .filter(img => img !== '');
        }
        
        // Handle pack options
        const packSize = row[columnPositions.packSize]?.trim() || '3 Pack';
        const regularPrice = parseFloat(row[columnPositions.price]) || 35;
        const salePrice = parseFloat(row[columnPositions.salePrice]) || 30;
        
        if (!isNaN(regularPrice)) {
            product.packOptions.push({
                size: packSize,
                regularPrice: regularPrice,
                salePrice: isNaN(salePrice) ? regularPrice : salePrice
            });
        }
        
        products.push(product);
    }
    
    return products;
}

// Handle product import based on selected option
function handleProductImport(newProducts, importOption) {
    const currentProducts = JSON.parse(localStorage.getItem('siteProducts') || '{}');
    let updatedProducts = {};
    
    if (importOption === 'replace') {
        // Replace all existing products
        newProducts.forEach(product => {
            updatedProducts[product.id] = product;
        });
    } else if (importOption === 'merge') {
        // Merge with existing products (update if ID exists)
        updatedProducts = { ...currentProducts };
        newProducts.forEach(product => {
            updatedProducts[product.id] = product;
        });
    } else if (importOption === 'add') {
        // Add only new products (skip if ID exists)
        updatedProducts = { ...currentProducts };
        newProducts.forEach(product => {
            if (!updatedProducts[product.id]) {
                updatedProducts[product.id] = product;
            }
        });
    }
    
    // Save updated products
    localStorage.setItem('siteProducts', JSON.stringify(updatedProducts));
}

// Show status message
function showSheetsStatus(title, message, type = 'info') {
    const statusContainer = document.getElementById('sheets-status');
    const statusTitle = document.getElementById('sheets-status-title');
    const statusMessage = document.getElementById('sheets-status-message');
    const previewContainer = document.getElementById('sheets-preview-container');
    
    statusContainer.style.display = 'block';
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    
    // Reset classes
    statusContainer.className = '';
    
    // Add appropriate style based on type
    switch (type) {
        case 'success':
            statusContainer.style.backgroundColor = 'rgba(0, 128, 0, 0.2)';
            statusContainer.style.border = '1px solid #00ff9f';
            break;
        case 'error':
            statusContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            statusContainer.style.border = '1px solid #ff5722';
            previewContainer.style.display = 'none';
            break;
        case 'loading':
            statusContainer.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            statusContainer.style.border = '1px solid #003b6f';
            previewContainer.style.display = 'none';
            break;
        default:
            statusContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            statusContainer.style.border = '1px solid #6a0dad';
    }
}

// Preview sheet data
function previewSheetData(data) {
    const previewContainer = document.getElementById('sheets-preview-container');
    const previewElement = document.getElementById('sheets-preview');
    
    if (data.length <= 1) {
        previewContainer.style.display = 'none';
        return;
    }
    
    // Get headers
    const headers = data[0];
    
    // Create preview HTML
    let previewHTML = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">';
    
    // Add header row
    previewHTML += '<tr>';
    headers.forEach(header => {
        previewHTML += `<th style="padding: 5px; text-align: left; border-bottom: 1px solid var(--primary-color);">${header}</th>`;
    });
    previewHTML += '</tr>';
    
    // Add data rows (up to 3)
    const maxRows = Math.min(4, data.length);
    for (let i = 1; i < maxRows; i++) {
        previewHTML += `<tr${i % 2 === 0 ? ' style="background-color: rgba(0, 0, 0, 0.1);"' : ''}>`;
        for (let j = 0; j < headers.length; j++) {
            const value = data[i][j] || '';
            previewHTML += `<td style="padding: 5px; border-bottom: 1px solid rgba(106, 13, 173, 0.3);">${value}</td>`;
        }
        previewHTML += '</tr>';
    }
    
    previewHTML += '</table></div>';
    
    // Show full preview
    previewElement.innerHTML = previewHTML;
    previewContainer.style.display = 'block';
}

// Add this to your existing initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sheets integration
    initializeGoogleSheetsIntegration();
});