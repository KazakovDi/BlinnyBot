export const calculatePower = (number) => {
  let power = 0;
  while (number >= 1) {
    number = number / 10;
    power++;
  }
  return power;
};
