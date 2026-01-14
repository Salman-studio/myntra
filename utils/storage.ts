import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user data
export const saveUserData = async (
  _id: string, 
  name: string, 
  email: string,
  token?: string,
  fullUserData?: any
) => {
  try {
    await AsyncStorage.setItem('user_id', _id);
    await AsyncStorage.setItem('user_name', name);
    await AsyncStorage.setItem('user_email', email);
    
    if (token) {
      await AsyncStorage.setItem('user_token', token);
    }
    
    if (fullUserData) {
      await AsyncStorage.setItem('user_full', JSON.stringify(fullUserData));
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const _id = await AsyncStorage.getItem('user_id');
    const name = await AsyncStorage.getItem('user_name');
    const email = await AsyncStorage.getItem('user_email');
    const token = await AsyncStorage.getItem('user_token');
    const fullUserData = await AsyncStorage.getItem('user_full');
    
    return {
      _id: _id || '',
      name: name || '',
      email: email || '',
      token: token || '',
      fullUser: fullUserData ? JSON.parse(fullUserData) : null
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { _id: '', name: '', email: '', token: '', fullUser: null };
  }
};

// Clear user data
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user_name');
    await AsyncStorage.removeItem('user_email');
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_full');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Save token only
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('user_token', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Get token only
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('user_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};