import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (
  key,
  value,
  callback = () => console.log('저장'),
) => {
  return await AsyncStorage.setItem(key, value, callback);
};

export const getStorage = async (key, callback = () => {}) => {
  const result = await AsyncStorage.getItem(key, callback);
  // console.log(result)
  return result;
};

export const removeItemFromStorage = async (
  key,

  callback = () => console.log('저장'),
) => {
  return await AsyncStorage.removeItem(key, callback);
};
