const amountReg = /^[0-9]+(\.[0-9]+)?$/;

export const validateAmount = (amount: string): boolean => {
  return amountReg.test(amount);
}

