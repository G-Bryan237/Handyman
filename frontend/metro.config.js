// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("tsx", "jsx");

module.exports = withNativeWind(config, { input: "./global.css" });
