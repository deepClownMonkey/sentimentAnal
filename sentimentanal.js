class SentimentAnalyzer {
    constructor() {
        this.sentimentCategories = {
            sad: [
                "sad", "depressed", "gloomy", "mournful", "blue", "heartbroken", "melancholy", "sorrowful",
                "despondent", "downcast", "forlorn", "woeful", "dismal", "tearful", "somber", "pensive",
                "disheartened", "crestfallen", "bereaved", "wistful", "anguished", "despairing", "grief-stricken",
                "lugubrious", "funereal", "morose", "doleful", "oppressed", "heavy-hearted", "bleak", "defeated",
                "broken", "lamenting", "joyless", "glum", "abject", "dejected", "sunk", "low-spirited"
            ],
            happy: [
                "happy", "joyful", "cheerful", "elated", "excited", "uplifted", "ecstatic", "blissful",
                "jubilant", "content", "delighted", "gleeful", "radiant", "buoyant", "euphoric", "thrilled",
                "overjoyed", "merry", "sunny", "chipper", "exuberant", "jaunty", "sprightly", "vivacious",
                "effervescent", "optimistic", "giddy", "jolly", "gleaming", "spirited", "festive", "sparkling",
                "gratified", "jovial", "peppy", "zestful", "on cloud nine", "walking on air", "in high spirits",
                // Added "love" as an example:
                "love", "loved"
            ],
            teasing: [
                "teasing", "playful", "mischievous", "joking", "jesting", "bantering", "kidding", "ribbing",
                "witty", "facetious", "roguish", "impish", "whimsical", "flirtatious", "tongue-in-cheek",
                "lighthearted", "sly", "cheeky", "roasting", "razzing", "joshing", "needling", "taunting"
            ],
            angry: [
                "angry", "furious", "irate", "enraged", "annoyed", "livid", "incensed", "outraged",
                "wrathful", "infuriated", "exasperated", "aggravated", "irritated", "resentful", "indignant",
                "fuming", "seething", "hostile", "vexed", "cross", "apoplectic", "irked", "riled"
            ],
            flustered: [
                "flustered", "embarrassed", "confused", "stammering", "disconcerted", "rattled", "abashed",
                "sheepish", "self-conscious", "nonplussed", "befuddled", "perturbed", "discomfited", "awkward",
                "blush", "hammering", "pounding", "flushed"
            ],
            nervous: [
                "nervous", "anxious", "worried", "jittery", "apprehensive", "edgy", "tense", "restless",
                "fidgety", "uneasy", "panicky", "fretful", "jumpy", "overwrought", "neurotic", "stressed",
                "hesitantly", "hesitating"
            ],
            corny: [
                "corny", "cheesy", "sappy", "clichéd", "trite", "tacky", "kitschy", "sentimental", "mawkish",
                "hokey", "overdone", "schmaltzy", "lame", "predictable", "stereotypical", "formulaic"
            ],
            bittersweet: [
                "bittersweet", "nostalgic", "melancholic", "wistful", "poignant", "touching", "tender",
                "reflective", "soulful", "pensive", "yearning", "longing", "reminiscent"
            ],
            laugh: [
                "laugh", "amused", "funny", "hilarious", "comical", "humorous", "witty", "jovial", "jocular",
                "mirthful", "chuckling", "giggling", "snickering", "cackling", "roaring"
            ],
            nuanced: [
                "nuanced", "subtle", "complex", "intricate", "sophisticated", "layered", "multifaceted",
                "detailed", "refined", "delicate", "shaded", "elaborate"
            ],
            exhausted: [
                "exhausted", "tired", "weary", "drained", "fatigued", "spent", "worn out", "burned out",
                "overworked", "dog-tired", "bushed", "knackered", "zonked"
            ],
            jealous: [
                "jealous", "envy", "covetous", "resentful", "green-eyed", "invidious", "grudging"
            ],
            grateful: [
                "grateful", "thankful", "appreciative", "obliged", "indebted", "beholden", "contented"
            ],
            focused: [
                "focused", "diligent", "concentrated", "productive", "attentive", "disciplined", "determined"
            ],
            arousal: [
                "aroused", "flushed", "desire", "wet", "turned on", "seductive", "tempting", "passionate",
                "lustful", "sensual", "erotic", "frisky", "horny", "heated", "stimulated", "provocative"
            ],
            showing: [
                "revealed", "glimpse", "revealing"
            ],
            liftup: [
                "upward", "fabric", "revealing", "lifted", "lifting", "shown"
            ]
        };
    }

    analyzeSentiment(text) {
        const lowerText = text.toLowerCase();
        let detectedSentiments = [];

        for (const [category, words] of Object.entries(this.sentimentCategories)) {
            // Use word boundaries in regex for more precise matching.
            if (words.some(word => new RegExp(`\\b${word}\\b`).test(lowerText))) {
                detectedSentiments.push(category);
            }
        }

        return detectedSentiments.length > 0 ? detectedSentiments : ["Non-neutral"];
    }
}
