# Android release checklist

Planning only: no Android wrapper or store release exists yet.

1. Approve the browser chapter build and test on real Android phones.
2. Add Capacitor and an Android project. Bundle only production HTML, scripts, styles, fonts, and artwork locally so the game works offline. Exclude labs, tests, study guides, Git files, and development tools.
3. Choose a permanent application ID, configure versioning, icons and splash, safe areas, Android Back behavior, pause/resume, sound, and save persistence. Browser saves do not automatically transfer to the Android app; account sync remains deferred.
4. Build a signed Android App Bundle (AAB) with Android Studio and configure Play App Signing. Keep the upload key and passwords out of Git. Use an APK for direct device testing, not as the planned Play upload artifact.
5. Create and verify the Play Console account. The registration fee is US$25 once; the account owner handles payment, identity checks, and agreements.
6. Prepare screenshots, icon, feature graphic, descriptions, support email, privacy policy, content rating, target-audience and Data safety declarations matching the actual app and any SDKs.
7. Run internal device testing: offline launch, low-end performance, audio interruptions, save persistence, upgrade, safe areas, and every level. Then complete the applicable closed-testing requirement and apply for production access.
8. Submit the reviewed build, monitor crashes and player feedback, and roll out gradually. Store approval is not guaranteed by passing local tests.

## Official references

- [Capacitor Android publishing](https://capacitorjs.com/docs/android/deploying-to-google-play)
- [Google Play account setup and fee](https://support.google.com/googleplay/android-developer/answer/6112435)
- [New personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465): accounts created after November 13, 2023 require at least 12 opted-in testers continuously for 14 days before applying for production access.
- [Target SDK requirement](https://developer.android.com/google/play/requirements/target-sdk): check the current requirement again when building the release.

Requirements checked September 4, 2026; recheck these official pages before submission.
