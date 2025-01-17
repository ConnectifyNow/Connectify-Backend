import { AVATARS_PATH, BASE_URL } from "../constants";

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomAvatarUrl = () => {
  return `${BASE_URL}${AVATARS_PATH}/avatar-${getRandomNumber(1, 9)}.png`;
};
