// lib/loadWidgets.js
export const loadPlugins = async () => {
  const context = require.context('../plugins', true, /index\.js$/);
  const plugins = await Promise.all(context.keys().map(context));
  return plugins.map(mod => mod.default);
};
