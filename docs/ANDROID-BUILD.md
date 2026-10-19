# Build the Orbit Shift APK (test) and AAB (Play Store)

For the owner's laptop (Capacitor + Android Studio installed) or an agent running on it. The repo already has `package.json`, `capacitor.config.json` and `scripts/build-www.mjs`. The `android/` folder is created once, by step 2.

**Requirements:** Node 20+, Android Studio (with an Android SDK and JDK 21; the bundled JBR is fine), and a USB-debugging phone or an emulator.

## 1. Get the code
```sh
git clone https://github.com/silverumer21/orbit-shift.git
cd orbit-shift
git checkout complete-remake-orbit-shift
npm install
```

## 2. Create the Android project (first time only)
```sh
npm run build:www        # copies only the game files into www/
npx cap add android      # creates android/
npx cap sync android
```
Commit the new `android/` folder, so later builds reuse it.

**Note:** `appId` in `capacitor.config.json` is `com.silverumer.orbitshift`. **It becomes permanent once uploaded to Play**, so change it before step 2 if you want another one.

## 3. Debug APK (install on your phone)
```sh
npm run android:apk
# result: android/app/build/outputs/apk/debug/app-debug.apk
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```
Or `npm run android:open` → Android Studio → **Run ▶** with the phone plugged in.

On Windows, run the gradle step as `cd android && gradlew.bat assembleDebug`.

## 4. App icon and splash
- In Android Studio: right-click `app/res` → **New → Image Asset**.
- Pick `design/paper-night/app-icon-1024.png`.
- Set the background to `#0A1F24`.

## 5. Test checklist on the phone
- [ ] Launches offline (airplane mode).
- [ ] Portrait only. If it rotates, set `android:screenOrientation="portrait"` on the activity in `android/app/src/main/AndroidManifest.xml`.
- [ ] Tap and hold feel right (no delay, no long-press menu or text selection).
- [ ] Sound plays, and stops when the app goes to the background.
- [ ] Progress is kept after the app is closed and reopened.
- [ ] The notch / status bar doesn't cover the HUD.
- [ ] Android Back button: note what it does. A proper Back handler (`@capacitor/app`) is a planned follow-up in the game code.
- [ ] Smooth on a low-end phone; play every level once.

Report anything odd back to the design session with a screenshot.

## 6. Signed AAB for Google Play
1. Android Studio → **Build → Generate Signed App Bundle / APK → Android App Bundle**.
2. Create an upload keystore. **Keep it and its passwords out of Git**, and back them up: losing them blocks future updates.
3. Choose the **release** variant → result: `android/app/release/app-release.aab`.
4. Bump `versionCode` (+1 every upload) and `versionName` in `android/app/build.gradle` before each new release.
5. In Play Console: enable Play App Signing and upload to **Internal testing** first.

New personal accounts must run a closed test with 12+ testers for 14 days before production. See `ANDROID-RELEASE.md` for the full store checklist.

## After every game change
```sh
git pull
npm run android:sync     # rebuild www/ and copy it into android/
npm run android:apk      # or Run ▶ in Android Studio
```
