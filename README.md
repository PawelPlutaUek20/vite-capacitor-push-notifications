# Vite Capacitor Push notifications

All that is required is your Firebase project's google-services.json file added to the module (app-level) directory of your android app.

```
android/
├─ app/
│  ├─ google-services.json
```

Make sure your app ID / bundle ID matches the ID you provided in Firebase app. For my demo app, it is `com.pawel.vspn`.

Set this ID in your `capacitor.config.ts` file under `appId`

## Available Scripts

In the project directory, you can run:

### `pnpm build`

Builds the app

### `npx cap sync android`

Updates the android files

### `npx cap open android`

Opens the android project

## Docs

https://capacitorjs.com/docs/apis/push-notifications
