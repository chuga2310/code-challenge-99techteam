export interface Token {
  currency: string;
  date: string;
  price: number;
}

// Get the latest price for each token
export const getLatestTokenPrices = (tokenList: Token[]) => {
  const uniqueTokens = [...new Set(tokenList.map((t) => t.currency))];

  return uniqueTokens.map((currency) => {
    const filteredTokens = tokenList
      .filter((t) => t.currency === currency)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filteredTokens[0];
  });
};