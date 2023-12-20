import { fetchApiData } from './apiCaller';

export var prefixes = [" ", "sm:", "md:", "lg:", "xl:", "xxl:"];

export const getPrefixes = async (fromDB = false) => {
  if (fromDB) {
    try {
      return await fetchApiData('your-api-endpoint');
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  } else {
    return prefixes;
  }
};