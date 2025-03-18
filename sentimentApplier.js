// ==UserScript==
// @name         Chat Observer with Floating Image Response (Gesture Zoom)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Observes chat and shows draggable, gesture-zoomable image when bot is happy
// @match        https://janitorai.com/chats/*
// @grant        GM_xmlhttpRequest
// @connect      github.com
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    // Variable to store the sentiment analyzer
    let sentimentAnalyzer = null;

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

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

    // Create floating image
    function createFloatingImage() {
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
        img.src = 'https://image.cdn2.seaart.me/2025-03-18/cvctnfle878c73cv7ieg/47cc3af54088944b0f2c5d47d0852790_high.webp';
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

        // Auto-hide after 60 seconds
        setTimeout(removeFloatingImage, 60000);
    }

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

    function removeFloatingImage() {
        const existingImage = document.getElementById('floating-sentiment-image');
        if (existingImage) {
            existingImage.remove();
        }
    }

    function getLatestBotResponse() {
        const items = document.querySelectorAll('[data-item-index]');
        if (items.length === 0) return;

        let latestItem = null;
        let maxIndex = -Infinity;
        items.forEach(item => {
            const index = parseInt(item.getAttribute('data-item-index'), 10);
            if (index > maxIndex) {
                maxIndex = index;
                latestItem = item;
            }
        });

        if (!latestItem) return;
        const botMessageElement = latestItem.querySelector('.css-ijnpk1');
        if (!botMessageElement) return;

        const botMessageText = botMessageElement.textContent.trim();
        
        // Only proceed if we have the sentiment analyzer loaded
        if (sentimentAnalyzer) {
            const sentiment = sentimentAnalyzer.analyzeSentiment(botMessageText);
            console.log("Latest Bot Response:", botMessageText);
            console.log("Detected Sentiments:", sentiment);

            // Display image if sentiment is "happy"
            if (sentiment.includes("happy")) {
                createFloatingImage();
            }
        }
    }

    // Fetch the sentiment analyzer code
    function fetchSentimentAnalyzer() {
        const url = 'https://raw.githubusercontent.com/deepClownMonkey/sentimentAnal/main/sentimentanal.js';
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        // Create a new function from the fetched code and execute it
                        const sentimentCode = response.responseText;
                        const SentimentAnalyzerConstructor = new Function(sentimentCode + '; return SentimentAnalyzer;')();
                        sentimentAnalyzer = new SentimentAnalyzerConstructor();
                        
                        console.log('Sentiment analyzer loaded successfully');
                        // Now that we have the analyzer, we can start observing
                        startObserving();
                    } catch (error) {
                        console.error('Error initializing sentiment analyzer:', error);
                    }
                } else {
                    console.error('Failed to fetch sentiment analyzer:', response.status);
                }
            },
            onerror: function(error) {
                console.error('Error fetching sentiment analyzer:', error);
            }
        });
    }

    function startObserving() {
        waitForElement('[data-testid="virtuoso-item-list"]', (chatContainer) => {
            console.log('Chat container found.');

            const observer = new MutationObserver(getLatestBotResponse);
            observer.observe(chatContainer, { childList: true, subtree: true });

            // Check current messages
            getLatestBotResponse();
        });
    }

    // Initialize
    function initialize() {
        addStyles();
        fetchSentimentAnalyzer();
    }

    initialize();
})();
