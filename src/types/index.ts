export type ProfileName = "Bianca" | "Samira" | "Luciana";

export type DrinkKey =
  | "drink"
  | "cerveja"
  | "whisky"
  | "vinho"
  | "espumante";

export type Drink = {
  id: DrinkKey;
  name: string;
  icon: string;
  bgColor: string;
};

export type Profile = {
  id: ProfileName;
  name: string;
  avatar: string;
};

export type DrinksCount = Record<DrinkKey, number>;

export type ProfilesData = Record<ProfileName, DrinksCount>;

export type ProfilePinMap = Record<ProfileName, string>;