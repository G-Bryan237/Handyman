module.exports = {
  expo: {
    name: "Handyman",
    slug: "handyman",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.handyman",
      jsEngine: "hermes"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.handyman",
      jsEngine: "hermes"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "handyman",
  }
};
