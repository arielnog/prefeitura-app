const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// Uniwind 1.12 redireciona InputAccessoryView para um wrapper que não existe no build web.
// Mantém o componente original do react-native-web nesse caso.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'uniwind/components/InputAccessoryView') {
    return context.resolveRequest(
      context,
      'react-native-web/dist/exports/InputAccessoryView',
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './uniwind-types.d.ts',
  extraThemes: ['dark'],
});
