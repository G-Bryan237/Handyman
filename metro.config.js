const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add supported extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, "tsx", "jsx"];

module.exports = withNativeWind(config, { input: "./global.css" });
