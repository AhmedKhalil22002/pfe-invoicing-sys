const isAlphabetic = (str: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(str);
};

const isAlphabeticOrSpace = (str: string) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(str);
};

const isValue = (str: string) => {
  return /^-?\d+(\.\d+)?$/.test(str);
};

export { isValue, isAlphabetic, isAlphabeticOrSpace };
