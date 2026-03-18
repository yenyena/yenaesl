export interface Word {
  id: string;
  text: string;
  image: string;
}

export interface Unit {
  id: string;
  month: string;
  week: number;
  label: string;
  words: Word[];
  oddOneOutLists: string[];
}

export interface CategoryItem {
  id: string;
  text: string;
  image: string;
}

export interface CategoryList {
  id: string;
  name: string;
  items: CategoryItem[];
}

export interface GameDef {
  id: string;
  name: string;
  subtitle: string;
  minWords: number;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  units: Unit[];
  categoryLists: CategoryList[];
}
