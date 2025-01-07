export const fetchTokenPrices = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_TOKEN_PRICE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};