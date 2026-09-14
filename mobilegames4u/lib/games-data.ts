import rawGamesData from '@/data/games.json';

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  version: string;
  rating: number;
  reviewsCount: number;
  downloadsCount: string;
  fileSize: string;
  requires: string;
  developer: string;
  packageId: string;
  updatedDate: string;
  isHot?: boolean;
  isTrending?: boolean;
  accentColor: string;
  gradient: string;
  iconUrl: string;
  imageLink: string;
  contentLockerLink?: string;
  modFeatures: string[];
  shortDescription: string;
  fullDescription: string;
  featuresList: { title: string; description: string }[];
  installSteps: string[];
  faqs: { question: string; answer: string }[];
  seoKeywords: string[];
}

export const GAMES_DATA: GameItem[] = (rawGamesData as any[]).map((game) => ({
  ...game,
  name: game.name || game.title,
  title: game.name || game.title,
  iconUrl: game.imageLink || game.iconUrl,
  imageLink: game.imageLink || game.iconUrl,
  contentLockerLink: game.contentLockerLink || "",
}));

// Dynamically extract unique categories directly from games that exist in the list
export const getAvailableCategories = (games: GameItem[] = GAMES_DATA): string[] => {
  const categorySet = new Set<string>();
  games.forEach((game) => {
    if (game.category && game.category.trim().length > 0) {
      categorySet.add(game.category.trim());
    }
  });
  return Array.from(categorySet).sort();
};

export const DYNAMIC_CATEGORIES = ["All", ...getAvailableCategories(GAMES_DATA)];
export const CATEGORIES = DYNAMIC_CATEGORIES;
export type GameCategory = string;
