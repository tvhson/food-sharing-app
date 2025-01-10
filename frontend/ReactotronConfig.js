import Reactotron, {asyncStorage, networking} from 'reactotron-react-native';

Reactotron.configure() // controls connection & communication settings
  .useReactNative(asyncStorage(), networking()) // add all built-in react native plugins
  .connect(); // let's connect!
