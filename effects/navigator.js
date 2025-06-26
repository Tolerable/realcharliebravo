/**
 * GeneticsTreeVisualizer - A simple D3-based strain genetics tree visualizer
 * Only handles the tree view visualization of strain relationships
 */

class GeneticsTreeVisualizer {
    constructor(options = {}) {
        // Configuration
        this.config = {
            treeElementId: options.treeElementId || 'genetics-tree',
            strainDescriptionId: options.strainDescriptionId || 'strain-description',
            expandAllId: options.expandAllId || 'expand-all',
            collapseAllId: options.collapseAllId || 'collapse-all',
            dataUrl: options.dataUrl || 'data/straindata.json'
        };
        
        // D3 visualization variables
        this.i = 0; // Counter for ID generation
        this.root = null; // Root of the tree data
        this.svg = null; // SVG element for the tree
        this.treemap = null; // D3 tree layout
        this.strainDescriptions = {}; // Object mapping strain names to descriptions
        
        // Initialize the visualizer
        this.init();
    }
    
    async init() {
        try {
            // Load strain data
            await this.loadStrainData();
            
            // Initialize visualization
            this.initializeVisualization();
            
            // Setup event listeners
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing GeneticsTreeVisualizer:', error);
        }
    }
    
    async loadStrainData() {
        try {
            const response = await fetch(this.config.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            // Store tree data
            this.strainTree = data.strainTree || { name: "Error", children: [] };
            
            // Create descriptions object from strains array
            this.strainDescriptions = {};
            if (data.strains) {
                data.strains.forEach(strain => {
                    this.strainDescriptions[strain.name] = strain.description;
                });
            }
            
            return data;
        } catch (error) {
            console.error('Error loading strain data:', error);
            throw error;
        }
    }
    
    initializeVisualization() {
        const treeElement = document.getElementById(this.config.treeElementId);
        
        // If no tree element or strainTree data is available
        if (!treeElement || !this.strainTree || !this.strainTree.name) {
            if (treeElement) {
                treeElement.innerHTML = '<p class="error-message">Error loading genetics tree data</p>';
            }
            return;
        }
        
        // D3.js Tree Visualization
        const width = treeElement.clientWidth;
        const height = 350;
        const isMobile = window.innerWidth <= 768;
        const margin = isMobile 
            ? {top: 20, right: 20, bottom: 20, left: 20} 
            : {top: 20, right: 90, bottom: 20, left: 90};
        
        // Clear any existing SVG
        d3.select(`#${this.config.treeElementId}`).select('svg').remove();
        
        // Create SVG
        this.svg = d3.select(`#${this.config.treeElementId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create tree layout
        this.treemap = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
        
        // Prepare data
        this.root = d3.hierarchy(this.strainTree);
        this.root.x0 = height / 2;
        this.root.y0 = isMobile ? -100 : 0; // Shift the starting point on mobile
        
        // Collapse all nodes initially except the first level
        if (this.root.children) {
            this.root.children.forEach(d => this.collapse(d));
        }
        
        // Start the visualization
        this.update(this.root);
    }
    
    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(child => this.collapse(child));
            d.children = null;
        }
    }
    
    update(source) {
        try {
            // Assigns the x and y position for the nodes
            const treeData = this.treemap(this.root);
            
            // Get the nodes and links from the hierarchy
            const nodes = treeData.descendants();
            const links = treeData.descendants().slice(1);
            
            // Normalize for fixed-depth
            nodes.forEach(d => {
                d.y = d.depth * 180;
            });
            
            // ****************** Nodes section ***************************
            
            // Update the nodes...
            const node = this.svg.selectAll('g.node')
                .data(nodes, d => d.id || (d.id = ++this.i));
            
            // Enter any new nodes at the parent's previous position
            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${source.y0},${source.x0})`)
                .on('click', (event, d) => this.click(event, d));
                
            // Add bubble/pill background for the nodes
            nodeEnter.append('rect')
                .attr('class', 'node-bubble')
                .attr('rx', 12) // Rounded corners
                .attr('ry', 12)
                .attr('x', -10)
                .attr('y', -15)
                .attr('width', d => Math.max(d.data.name.length * 8, 40)) // Width based on text length
                .attr('height', 30)
                .style('fill', d => d._children ? '#c69c6d' : '#b87333')
                .style('stroke', '#b87333')
                .style('stroke-width', 2)
                .attr('cursor', 'pointer');
            
            // Add labels for the nodes
            nodeEnter.append('text')
                .attr('dy', '.35em')
                .attr('x', d => d.data.name.length * 8 / 2 - 10) // Center text in bubble
                .attr('text-anchor', 'middle')
                .text(d => d.data.name)
                .style('font-size', '12px')
                .style('fill', '#f5f0e6')
                .attr('cursor', 'pointer');
            
            // UPDATE
            const nodeUpdate = nodeEnter.merge(node);
            
            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(750)
                .attr('transform', d => `translate(${d.y},${d.x})`);
            
            // Update the node attributes and style
            nodeUpdate.select('rect.node-bubble')
                .attr('width', d => Math.max(d.data.name.length * 8, 40))
                .style('fill', d => d._children ? '#c69c6d' : '#b87333');
            
            // Remove any exiting nodes
            const nodeExit = node.exit().transition()
                .duration(750)
                .attr('transform', d => `translate(${source.y},${source.x})`)
                .remove();
            
            // On exit reduce the bubble opacity
            nodeExit.select('rect.node-bubble')
                .attr('fill-opacity', 1e-6);
            
            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);
            
            // ****************** links section ***************************
            
            // Update the links...
            const link = this.svg.selectAll('path.link')
                .data(links, d => d.id);
            
            // Enter any new links at the parent's previous position
            const linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', d => {
                    const o = {x: source.x0, y: source.y0};
                    return this.diagonal(o, o);
                })
                .style('fill', 'none')
                .style('stroke', '#c69c6d')
                .style('stroke-width', 2);
            
            // UPDATE
            const linkUpdate = linkEnter.merge(link);
            
            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(750)
                .attr('d', d => this.diagonal(d, d.parent));
            
            // Remove any exiting links
            link.exit().transition()
                .duration(750)
                .attr('d', d => {
                    const o = {x: source.x, y: source.y};
                    return this.diagonal(o, o);
                })
                .remove();
            
            // Store the old positions for transition
            nodes.forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
            
            // Show strain description when clicking on a node
            if (source && source.data && source.data.name) {
                const description = this.strainDescriptions[source.data.name] || "No information available for this strain.";
                const strainDescriptionEl = document.getElementById(this.config.strainDescriptionId);
                if (strainDescriptionEl) {
                    strainDescriptionEl.innerText = description;
                }
            }
        } catch (error) {
            console.error("Error in update function:", error);
        }
    }
    
    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }
    
    click(event, d) {
        try {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            
            // Update the tree
            this.update(d);
            
            // Find the strain data to display more information
            const strainName = d.data.name;
            const strainDescriptionEl = document.getElementById(this.config.strainDescriptionId);
            
            if (!strainDescriptionEl) return;
            
            // Don't try to find parent categories as strains
            if (strainName === "Brokkr Genetics" || 
                strainName === "Anvil Series" || 
                strainName === "Forge Collection" || 
                strainName === "Heirloom Treasures") {
                strainDescriptionEl.innerText = 
                    `${strainName} is a collection of strains. Click on individual strain names to see detailed information.`;
                return;
            }
            
            // Use the description from our strainDescriptions object
            const description = this.strainDescriptions[strainName];
            
            if (description) {
                // Show comprehensive strain info
                strainDescriptionEl.innerHTML = `<strong>${strainName}</strong>: ${description}`;
            } else {
                // Fallback
                strainDescriptionEl.innerText = "No information available for this strain.";
            }
        } catch (error) {
            console.error("Error in click handler:", error);
        }
    }
    
    expandAll() {
        if (this.root) {
            this.expandAllNodes(this.root);
            this.update(this.root);
        }
    }
    
    expandAllNodes(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
            d.children.forEach(child => this.expandAllNodes(child));
        } else if (d.children) {
            d.children.forEach(child => this.expandAllNodes(child));
        }
    }
    
    collapseAll() {
        if (this.root && this.root.children) {
            this.root.children.forEach(child => this.collapse(child));
            this.update(this.root);
        }
    }
    
    setupEventListeners() {
        // Expand all button
        const expandAllBtn = document.getElementById(this.config.expandAllId);
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.expandAll();
            });
        }
        
        // Collapse all button
        const collapseAllBtn = document.getElementById(this.config.collapseAllId);
        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.collapseAll();
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Debounce the resize event
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.initializeVisualization();
            }, 250);
        });
    }
}

// Export the GeneticsTreeVisualizer class
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GeneticsTreeVisualizer;
} else {
    window.GeneticsTreeVisualizer = GeneticsTreeVisualizer;
}