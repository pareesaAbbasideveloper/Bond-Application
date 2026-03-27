import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
/**
 * Function to decode a JWT token.
 * @param {string} token - The JWT token to decode.
 * @returns {object|null} Decoded JWT token object or null if decoding fails.
 */
export const decodeToken = token => {
  console.log(token);
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Function to load and decode a JWT token.
 * @param {string} tokenKey - The key to retrieve the token from storage (e.g., AsyncStorage).
 * @returns {object} An object containing both the raw token and the decoded token, or null values if loading/decoding fails.
 */
const loadAndDecodeToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
    if (token) {
      const decodedToken = decodeToken(token); // Decode the token
      console.log('this coming from function ', decodeToken);

      return {
        token,
        decodedToken, // Include both the raw token and the decoded token
      };
    } else {
      console.error('Token not found in storage.');
      return {
        token: null,
        decodedToken: null,
      };
    }
  } catch (error) {
    console.error('Error loading/decoding token:', error);
    return {
      token: null,
      decodedToken: null,
    };
  }
};

export default loadAndDecodeToken;
