const isAlphabetic = (str: string) => {
  return /^[A-Za-z]+$/.test(str);
};

const isAlphabeticOrSpace = (str: string) => {
  return /^[A-Za-z\s]+$/.test(str);
};

export { isAlphabetic, isAlphabeticOrSpace };
