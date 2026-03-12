# Deploying Photobooth Pirate

## 1. Firebase Setup (for shared mutiny)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (skip Google Analytics)
3. Add a **Web app** (Settings > General > Your apps > Add app > Web)
4. Copy the config values into `firebase-config.js`

### Enable Anonymous Auth

1. Go to **Authentication > Sign-in method**
2. Enable **Anonymous**

### Create Realtime Database

1. Go to **Realtime Database > Create Database**
2. Choose your region, start in **test mode**
3. Replace the default rules with:

```json
{
  "rules": {
    "mutiny": {
      "voters": {
        "$guestName": {
          ".read": "auth != null",
          ".write": "auth != null && !data.exists()"
        }
      },
      ".read": "auth != null"
    }
  }
}
```

These rules ensure:
- Only authenticated users can read/write
- Each guest name can only be written once (no overwrites, no deletions)
- All authenticated users can read the full voter list

## 2. Fal AI Setup (for photo transformation)

1. Get an API key from [fal.ai](https://fal.ai)
2. On the deployed app, open browser console and run:
   ```js
   localStorage.setItem('fal_api_key', 'YOUR_KEY_HERE')
   ```
3. Refresh the page

## 3. Deploy to GitHub Pages

```bash
# Init repo if needed
git init
git add index.html style.css app.js guests.js firebase-config.js DEPLOY.md
git commit -m "Photobooth Pirate v2"

# Push to GitHub
gh repo create photobooth-pirate --public --source=. --push

# Enable GitHub Pages
# Go to repo Settings > Pages > Source: Deploy from branch > main > / (root)
```

The site will be live at `https://YOUR_USERNAME.github.io/photobooth-pirate/`

## 4. Offline Mode (no Firebase)

If you skip Firebase setup, the app works with localStorage only.
Each phone tracks its own votes locally (no real-time sync between devices).
The `FIREBASE_ENABLED` flag in `firebase-config.js` auto-detects this.

## 5. Reset Mutiny

### Firebase
Delete the `mutiny` node from the Realtime Database console.

### localStorage
Open browser console: `localStorage.removeItem('pirate_mutiny_voters'); localStorage.removeItem('pirate_mutiny_launched')`
