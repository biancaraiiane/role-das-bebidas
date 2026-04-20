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

export type ProfilePinMap = Record<ProfileName, string>;

export type RankingRow = {
  id: number;
  profile_name: ProfileName;
  drink: number;
  cerveja: number;
  whisky: number;
  vinho: number;
  espumante: number;
  updated_at: string;
};