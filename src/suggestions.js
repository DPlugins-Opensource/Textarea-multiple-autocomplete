import { fetchApiData } from './apiCaller';

export var suggestions = [
  "white",
  "yellow",
  "blue",
  "red",
  "green",
  "black",
  "brown",
  "azure",
  "ivory",
  "teal",
];

export const getSuggestions = async (fromDB = false) => {
  if (fromDB) {
    try {
      return await fetchApiData('your-api-endpoint');
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  } else {
    return suggestions;
  }
};