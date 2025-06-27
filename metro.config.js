/**
 * metro.config.js
 * Minimal Metro config to fix "No Metro config found" error.
 */
// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = getDefaultConfig(__dirname);

