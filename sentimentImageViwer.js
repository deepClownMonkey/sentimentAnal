// Sentiment Image Viewer Module
// Provides functionality for creating, managing, and interacting with floating images

const SentimentImageViewer = (function() {
    'use strict';
    
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
                transform-origin: center;
                transition: transform 0.1s ease;
            }
            .floating-image {
                max-width: 250px;
                max-height: 250px;
                border-radius: 8px;
                display: block;
            }
            .zoom-indicator {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.5);
                color: white;
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .floating-image-container:hover .zoom-indicator {
                opacity: 0.7;
            }
            .close-button {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(255,85,85,0.9);
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                opacity: 0.8;
                transition: opacity 0.2s;
                z-index: 10;
            }
            .close-button:hover {
                opacity: 1;
            }
            .info-text {
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 11px;
                color: #666;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }

    // Make an element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        // Touch support for dragging
        element.addEventListener('touchstart', handleTouchStart, { passive: false });

        function handleTouchStart(e) {
            // Don't initiate drag when touching close button
            if (e.target.className === 'close-button') return;

            if (e.touches.length !== 1) return; // Only handle single touch for dragging
            e.preventDefault();

            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd, { passive: false });
        }

        function handleTouchMove(e) {
            if (e.touches.length !== 1) return;
            e.preventDefault();

            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;

            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
            element.style.bottom = "auto";
        }

        function handleTouchEnd() {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }

        function dragMouseDown(e) {
            // Don't initiate drag when clicking close button
            if (e.target.className === 'close-button') return;

            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            // If we're using absolute positioning, adjust right/bottom to auto
            element.style.right = "auto";
            element.style.bottom = "auto";
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Remove floating image from the DOM
    function removeFloatingImage() {
        const existingImage = document.getElementById('floating-sentiment-image');
        if (existingImage) {
            existingImage.remove();
        }
    }

    // Create and add floating image to the DOM
    function createFloatingImage(imageUrl = 'https://image.cdn2.seaart.me/2025-03-18/cvctnfle878c73cv7ieg/47cc3af54088944b0f2c5d47d0852790_high.webp', 
                               autoHideTime = 60000) {
        // Remove any existing floating image
        removeFloatingImage();

        const container = document.createElement('div');
        container.className = 'floating-image-container';
        container.id = 'floating-sentiment-image';

        // Create an image wrapper that will be zoomed
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        container.appendChild(wrapper);

        // Add the image to the wrapper
        const img = document.createElement('img');
        img.className = 'floating-image';
        img.src = imageUrl;
        img.alt = 'Happy AI Response';
        wrapper.appendChild(img);

        // Add zoom level indicator (in the wrapper)
        const zoomIndicator = document.createElement('div');
        zoomIndicator.className = 'zoom-indicator';
        zoomIndicator.textContent = '100%';
        wrapper.appendChild(zoomIndicator);

        // Add close button (now inside the wrapper so it scales with zoom)
        const closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.title = 'Close';
        closeButton.onclick = function(e) {
            e.stopPropagation();
            removeFloatingImage();
        };
        wrapper.appendChild(closeButton);

        // Add info text (in the container, outside the wrapper)
        const infoText = document.createElement('div');
        infoText.className = 'info-text';
        infoText.textContent = 'Scroll to zoom, double-click to reset';
        container.appendChild(infoText);

        document.body.appendChild(container);

        // Make draggable
        makeDraggable(container);

        // Set up zoom functionality
        let currentZoom = 1;

        // Using wheel event for scroll-based zooming
        container.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent page scrolling

            // Zoom in or out based on scroll direction
            if (e.deltaY < 0) {
                // Scroll up - zoom in
                if (currentZoom < 7) {  // Increased max zoom to 700%
                    currentZoom += 0.1;
                }
            } else {
                // Scroll down - zoom out
                if (currentZoom > 0.3) {
                    currentZoom -= 0.1;
                }
            }

            // Apply zoom and update indicator
            currentZoom = Math.round(currentZoom * 10) / 10; // Round to 1 decimal place
            wrapper.style.transform = `scale(${currentZoom})`;
            zoomIndicator.textContent = `${Math.round(currentZoom * 100)}%`;

            // Show indicator briefly
            zoomIndicator.style.opacity = '0.7';
            setTimeout(() => {
                if (container.matches(':hover')) return;
                zoomIndicator.style.opacity = '0';
            }, 1000);
        });

        // Double-click to reset zoom
        img.ondblclick = () => {
            currentZoom = 1;
            wrapper.style.transform = 'scale(1)';
            zoomIndicator.textContent = '100%';
            zoomIndicator.style.opacity = '0.7';
            setTimeout(() => {
                if (container.matches(':hover')) return;
                zoomIndicator.style.opacity = '0';
            }, 1000);
        };

        // Touch gesture support for mobile
        let initialDistance = 0;
        let initialZoom = 1;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialZoom = currentZoom;
            }
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );

                const ratio = currentDistance / initialDistance;
                currentZoom = Math.min(Math.max(initialZoom * ratio, 0.3), 7);  // Increased max zoom to 7 (700%)

                wrapper.style.transform = `scale(${currentZoom})`;
                zoomIndicator.textContent = `${Math.round(currentZoom * 100)}%`;
                zoomIndicator.style.opacity = '0.7';
            }
        }, { passive: false });

        container.addEventListener('touchend', () => {
            currentZoom = Math.round(currentZoom * 10) / 10; // Round to 1 decimal place
            setTimeout(() => {
                if (container.matches(':hover')) return;
                zoomIndicator.style.opacity = '0';
            }, 1000);
        });

        // Auto-hide after specified time
        if (autoHideTime > 0) {
            setTimeout(removeFloatingImage, autoHideTime);
        }
        
        return container;
    }

    // Initialize the module
    function initialize() {
        addStyles();
    }

    // Public API
    return {
        initialize: initialize,
        createFloatingImage: createFloatingImage,
        removeFloatingImage: removeFloatingImage,
        makeDraggable: makeDraggable
    };
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SentimentImageViewer;
} else {
    // Make available globally when included directly in browser
    window.SentimentImageViewer = SentimentImageViewer;
}
