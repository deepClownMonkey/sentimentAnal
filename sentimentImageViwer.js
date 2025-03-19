// SentimentImageApplier.js - to be uploaded to https://github.com/deepClownMonkey/sentimentAnal/blob/main/sentimentApplier.js

class SentimentImageApplier {
    constructor(imageHandler) {
        this.imageHandler = imageHandler;
        this.sentimentAnalyzer = null;
        this.imageMap = {
            'happy': 'https://image.cdn2.seaart.me/2025-03-18/cvctnfle878c73cv7ieg/47cc3af54088944b0f2c5d47d0852790_high.webp',
            'sad': 'https://example.com/sad-image.jpg',
            'angry': 'https://example.com/angry-image.jpg',
            'surprised': 'https://example.com/surprised-image.jpg',
            'neutral': 'https://example.com/neutral-image.jpg'
            // Add more sentiment-to-image mappings as needed
        };
        
        this.initializeSentimentAnalyzer();
    }
    
    initializeSentimentAnalyzer() {
        // Load the sentiment analyzer script
        const script = document.createElement('script');
        script.src = 'https://raw.githubusercontent.com/deepClownMonkey/sentimentAnal/main/sentimentanal.js';
        script.onload = () => {
            if (window.SentimentAnalyzer) {
                this.sentimentAnalyzer = new window.SentimentAnalyzer();
                console.log('Sentiment analyzer initialized successfully in applier');
            } else {
                console.error('SentimentAnalyzer not found after loading script');
            }
        };
        script.onerror = () => {
            console.error('Failed to load sentiment analyzer script');
        };
        document.head.appendChild(script);
    }
    
    processMessage(messageText) {
        if (!this.sentimentAnalyzer) {
            console.warn('Sentiment analyzer not initialized yet');
            return;
        }
        
        try {
            // Analyze the message sentiment
            const sentiments = this.sentimentAnalyzer.analyzeSentiment(messageText);
            console.log('Detected sentiments:', sentiments);
            
            // Check if we have an image for any of the detected sentiments
            for (const sentiment of sentiments) {
                if (this.imageMap[sentiment]) {
                    console.log(`Showing image for sentiment: ${sentiment}`);
                    this.imageHandler.showImage(this.imageMap[sentiment]);
                    return; // Show only the first matching sentiment image
                }
            }
            
            // If no specific sentiment matched but "happy" is detected, show default happy image
            if (sentiments.includes('happy')) {
                console.log('Showing default happy image');
                this.imageHandler.showImage(this.imageMap['happy']);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
    
    // Method to add custom sentiment-image mappings
    addImageMapping(sentiment, imageUrl) {
        if (sentiment && imageUrl) {
            this.imageMap[sentiment.toLowerCase()] = imageUrl;
            return true;
        }
        return false;
    }
    
    // Method to remove a mapping
    removeImageMapping(sentiment) {
        if (sentiment && this.imageMap[sentiment.toLowerCase()]) {
            delete this.imageMap[sentiment.toLowerCase()];
            return true;
        }
        return false;
    }
}

// Make the class accessible globally
if (typeof window !== 'undefined') {
    window.SentimentImageApplier = SentimentImageApplier;
}

// For Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SentimentImageApplier;
}
