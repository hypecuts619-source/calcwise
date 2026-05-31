import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calcwise.app',
  appName: 'CalcWise',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
