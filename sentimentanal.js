// ==UserScript==
// @name         Chat Observer with Advanced Sentiment Analysis
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Observes chat and detects bot response sentiment with expanded keyword analysis
// @match        https://janitorai.com/chats/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // Sentiment categories with related words
    const sentimentCategories = {
        sad: ["sad", "depressed", "gloomy", "mournful", "blue", "heartbroken", "melancholy", "sorrowful"],
        happy: ["happy", "joyful", "cheerful", "elated", "excited", "uplifted", "ecstatic", "blissful"],
        teasing: ["teasing", "playful", "mischievous", "joking", "jesting", "bantering", "kidding", "ribbing"],
        angry: ["angry", "furious", "irate", "enraged", "annoyed", "livid", "incensed", "outraged"],
        flustered: ["flustered", "embarrassed", "confused", "stammering", "disconcerted", "rattled", "abashed"],
        nervous: ["nervous", "anxious", "worried", "jittery", "apprehensive", "edgy", "tense", "restless"],
        corny: ["corny", "cheesy", "sappy", "clichéd", "trite", "tacky", "kitschy", "sentimental"],
        bittersweet: ["bittersweet", "nostalgic", "melancholic", "wistful", "poignant", "touching", "tender"],
        laugh: ["laugh", "amused", "funny", "hilarious", "comical", "humorous", "witty", "jovial"],
        nuanced: ["nuanced", "subtle", "complex", "intricate", "sophisticated", "layered", "multifaceted"],
        exhausted: ["exhausted", "tired", "weary", "drained", "fatigued", "spent", "worn out"],
        jealous: ["jealous", "envy", "covetous", "resentful", "green-eyed", "invidious", "grudging"],
        grateful: ["grateful", "thankful", "appreciative", "obliged", "indebted", "beholden", "contented"],
        focused: ["focused", "diligent", "concentrated", "productive", "attentive", "disciplined", "determined"],
        arousal: ["aroused", "flushed", "desire", "wet", "turned on", "seductive", "tempting", "passionate"]
    };

    // Function to analyze sentiment in a given text
    function analyzeSentiment(text) {
        const lowerText = text.toLowerCase();
        let detectedSentiments = [];

        for (const [category, words] of Object.entries(sentimentCategories)) {
            if (words.some(word => lowerText.includes(word))) {
                detectedSentiments.push(category);
            }
        }

        return detectedSentiments.length > 0 ? detectedSentiments.join(", ") : "Neutral 😐";
    }

    // Function to get the latest bot response
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
        const sentiment = analyzeSentiment(botMessageText);

        console.log("Latest Bot Response:", botMessageText);
        console.log("Detected Sentiments:", sentiment);

        // Store sentiment globally so other scripts can access it
        window.lastDetectedSentiment = sentiment;
    }

    // Wait for chat to load and start observing
    waitForElement('[data-testid="virtuoso-item-list"]', (chatContainer) => {
        console.log('Chat container found.');

        const observer = new MutationObserver(getLatestBotResponse);
        observer.observe(chatContainer, { childList: true, subtree: true });

        getLatestBotResponse();
    });
})();
