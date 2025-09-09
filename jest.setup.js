/* global jest */
import '@testing-library/jest-native/extend-expect';

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'https://swapi.tech/api'
      }
    }
  }
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  openURL: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation((message) => {
  if (message && message.includes('Warning:')) {
    return;
  }
  console.log(message);
});