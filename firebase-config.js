// ══════════════════════════════════════
// FIREBASE CONFIG
// ══════════════════════════════════════
// 1. Go to console.firebase.google.com
// 2. Create a project (skip Analytics)
// 3. Add a Web app, copy your config below
// 4. Enable Authentication > Sign-in method > Anonymous
// 5. Create Realtime Database > Start in test mode
// 6. Paste security rules from DEPLOY.md
// ══════════════════════════════════════

var FIREBASE_CONFIG = {
    apiKey:            "AIzaSyCedAd2j2o98LyiU4i0hkk7LHiRVVGn2mE",
    authDomain:        "photobooth-pirate.firebaseapp.com",
    databaseURL:       "https://photobooth-pirate-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:         "photobooth-pirate",
    storageBucket:     "photobooth-pirate.firebasestorage.app",
    messagingSenderId: "162341012907",
    appId:             "1:162341012907:web:a17885deab0bb7b60e3eee"
};

// Set to false to use localStorage fallback (offline mode)
var FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "PASTE_YOUR_API_KEY";
