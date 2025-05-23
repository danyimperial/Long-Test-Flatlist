/**
 * @format
 */
import 'react-native-gesture-handler'; // 👈 Must be first!
import 'react-native-reanimated';  // <- this import is important
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
