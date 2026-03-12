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
    apiKey:            "PASTE_YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId:         "YOUR_PROJECT",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

// Set to false to use localStorage fallback (offline mode)
var FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "PASTE_YOUR_API_KEY";
