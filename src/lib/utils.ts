import {
  DrinkKey,
  DrinksCount,
  ProfileName,
  ProfilesData,
} from "@/types";

export const emptyDrinksCount = (): DrinksCount => ({
  drink: 0,
  cerveja: 0,
  whisky: 0,
  vinho: 0,
  espumante: 0,
});

export const initialProfilesData = (): ProfilesData => ({
  Bianca: emptyDrinksCount(),
  Samira: emptyDrinksCount(),
  Luciana: emptyDrinksCount(),
});

export function getProfileTotal(drinks: DrinksCount) {
  return Object.values(drinks).reduce((acc, value) => acc + value, 0);
}

export function getGroupTotal(data: ProfilesData) {
  return Object.values(data).reduce((acc, profileDrinks) => {
    return acc + getProfileTotal(profileDrinks);
  }, 0);
}

export function incrementDrink(
  data: ProfilesData,
  profile: ProfileName,
  drink: DrinkKey
): ProfilesData {
  return {
    ...data,
    [profile]: {
      ...data[profile],
      [drink]: data[profile][drink] + 1,
    },
  };
}

export function getRanking(data: ProfilesData) {
  return (Object.keys(data) as ProfileName[])
    .map((name) => ({
      name,
      total: getProfileTotal(data[name]),
    }))
    .sort((a, b) => b.total - a.total);
}