# expo-privacy-manifest-polyfill-plugin

Expo Config Plugin to configure Apple privacy manifests in SDK49 and below.

For SDK50+, the plugin lives in [@expo/config-plugins](https://github.com/expo/expo/tree/main/packages/%40expo/config-plugins) and can be used by default.

Learn more: https://docs.expo.dev/guides/apple-privacy/

## Expo installation

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with yarn, npm, or [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
npx expo install expo-privacy-manifest-polyfill-plugin
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["expo-privacy-manifest-polyfill-plugin"]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## Example

Use the `NSPrivacyAccessedAPIType` and `NSPrivacyAccessedAPITypeReasons` values listed in https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api.

Include these values under `ios.privacyManifests` in your **app.json** / **app.config.js**. The config plugin does not accept any parameters itself. Rather, it reads the privacy values from `ios.privacyManifests` and uses these to create an embed a **PrivacyInfo.xcprivacy** file in your native project during Prebuild.

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    // ...
    "ios": {
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ]
      }
    }
  }
}
```

## Upgrading to SDK 50+
Once you upgrade your project to SDK 50 or higher, the plugin integrated into `@expo/config-plugins` handles this automatically. You can remove `expo-privacy-manifest-polyfill-plugin` from your dependencies and from the `plugins` array in your app config. Leave any needed values in `ios.privacyManifests`, as SDK 50+'s plugin will use that same configuration.