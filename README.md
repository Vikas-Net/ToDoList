# Office Task Board

A personal to-do board with create, read, update and delete, saved in Firebase Firestore.
Plain HTML, CSS and JavaScript, so it runs on GitHub Pages with no backend.

## 1. Create the Firebase database (about 5 minutes)

1. Go to https://console.firebase.google.com and click **Add project**. Skip Google Analytics.
2. In the project, open **Build > Firestore Database > Create database**. Choose a location near you (for India, `asia-south1`) and start in **production mode**.
3. Open the **Rules** tab, paste the contents of `firestore.rules`, and click **Publish**.
4. Open **Project settings** (gear icon) > **Your apps** > click the web icon `</>`. Give the app a name and register it. Do not tick Firebase Hosting.
5. Copy the `firebaseConfig` values it shows into `firebase-config.js`.

## 2. Try it on your computer

Browsers block ES modules from `file://`, so run a tiny server in this folder:

    python3 -m http.server 8000

Then open http://localhost:8000. Click **Load my starter tasks** once to import your Task Sheet.
Until the config is pasted, the site runs in demo mode and saves tasks in your browser only.

## 3. Publish on GitHub Pages

1. Create a repository and upload all files in this folder to the `main` branch.
2. Repository **Settings > Pages > Build and deployment**: Source = **Deploy from a branch**, Branch = `main`, folder = `/ (root)`.
3. After a minute your board is live at `https://<your-username>.github.io/<repo-name>/`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and the add/edit dialog |
| `style.css` | Colours, layout, dark mode |
| `app.js` | Screens and the create / read / update / delete actions |
| `store.js` | Database layer: Firestore, or browser storage in demo mode |
| `seed.js` | Your starter tasks from the Task Sheet |
| `firebase-config.js` | Your Firebase keys |
| `firestore.rules` | Database rules to paste into Firebase |

## About the open rules

The rules let anyone who has your site address read and change the tasks. That keeps setup simple, but the
Firebase config is visible in the page source, so treat the board as semi-public and avoid putting client
secrets or personal data in tasks. To restrict it later, turn on Firebase Authentication (Google sign-in) and change
the rule to `allow read, write: if request.auth != null;`.
