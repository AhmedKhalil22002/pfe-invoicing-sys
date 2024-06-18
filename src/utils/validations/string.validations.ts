const isAlphabetic = (str: string) => {
  return /^[A-Za-z]+$/.test(str);
};

const isAlphabeticOrSpace = (str: string) => {
  return /^[A-Za-z\s]+$/.test(str);
};

const isValue = (str: string) => {
  return /^-?\d+(\.\d+)?$/.test(str);
};

export { isValue, isAlphabetic, isAlphabeticOrSpace };
