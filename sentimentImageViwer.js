// Sentiment Image Viewer Module
// Provides functionality for creating, managing, and interacting with
// floating images

const SentimentImageViewer = (function() {
    'use strict';
    
    // Private variables
    let imageContainer = null;
    let currentImage = null;
    
    // Create and append stylesheet
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-image-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                cursor: move;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            }
            .image-wrapper {
                position: relative;
                display: inline-block;
                max-width: 150px;
                max-height: 150px;
                border-radius: 10px;
                overflow: hidden;
            }
            .close-button {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                line-height: 1;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .floating-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create container for floating images
    function createContainer() {
        if (imageContainer) return;
        
        imageContainer = document.createElement('div');
        imageContainer.className = 'floating-image-container';
        document.body.appendChild(imageContainer);
        
        // Make the container draggable
        let isDragging = false;
        let offsetX, offsetY;
        
        imageContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - imageContainer.getBoundingClientRect().left;
            offsetY = e.clientY - imageContainer.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            imageContainer.style.right = 'auto';
            imageContainer.style.bottom = 'auto';
            imageContainer.style.left = (e.clientX - offsetX) + 'px';
            imageContainer.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
    
    // Public methods
    return {
        initialize: function() {
            addStyles();
            createContainer();
            console.log('[SentimentImageViewer] Initialized successfully');
        },
        
        createFloatingImage: function() {
            if (!imageContainer) {
                this.initialize();
            }
            
            // Remove existing image if any
            this.removeFloatingImage();
            
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';
            
            // Create image element
            const img = document.createElement('img');
            img.className = 'floating-image';
            img.src = 'https://image.cdn2.seaart.me/2025-03-19/cvd3p3de878c73fu24e0/b6c108f061627123f75223d19d24e782_high.webp'; // Happy emoji image
            img.alt = 'Happy Reaction';
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-button';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = this.removeFloatingImage;
            
            // Append elements
            wrapper.appendChild(img);
            wrapper.appendChild(closeBtn);
            imageContainer.appendChild(wrapper);
            
            currentImage = wrapper;
            return wrapper;
        },
        
        removeFloatingImage: function() {
            if (currentImage && imageContainer) {
                imageContainer.removeChild(currentImage);
                currentImage = null;
            }
        }
    };
})();

// Export to global scope
window.SentimentImageViewer = SentimentImageViewer;
