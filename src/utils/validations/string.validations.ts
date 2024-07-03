const isAlphabetic = (str: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(str);
};

const isAlphabeticOrSpace = (str: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(str);
};

const isValue = (str: string) => {
  return /^-?\d+(\.\d+)?$/.test(str);
};

const isEmail = (str: string): boolean => {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
};

export { isValue, isAlphabetic, isAlphabeticOrSpace, isEmail };
