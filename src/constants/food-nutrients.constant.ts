export interface FoodNutrient {
  id: number;
  name: string;
  title: string;
  isRequired: boolean;
  unit: string;
}

const FOOD_NUTRIENTS: Record<string, FoodNutrient> = {
  NANG_LUONG: {
    id: 1,
    name: "ENERGY",
    title: "Năng lượng",
    isRequired: true,
    unit: "kcal",
  },
  NUOC: {
    id: 2,
    name: "WATER",
    title: "Nước",
    isRequired: false,
    unit: "ml",
  },
  CHAT_DAM: {
    id: 3,
    name: "PROTEIN",
    title: "Chất đạm",
    isRequired: true,
    unit: "g",
  },
  CHAT_DAM_DONG_VAT: {
    id: 4,
    name: "ANIMAL_PROTEIN",
    title: "Chất đạm động vật",
    isRequired: false,
    unit: "g",
  },
  CHAT_DAM_THUC_VAT: {
    id: 5,
    name: "VEGETABLE_PROTEIN",
    title: "Chất đạm thực vật",
    isRequired: false,
    unit: "g",
  },
  CHAT_BEO: {
    id: 6,
    name: "FAT",
    title: "Chất béo",
    isRequired: true,
    unit: "g",
  },
  CHAT_BEO_DONG_VAT: {
    id: 7,
    name: "ANIMAL_FAT",
    title: "Chất béo động vật",
    isRequired: false,
    unit: "g",
  },
  CHAT_BEO_THUC_VAT: {
    id: 8,
    name: "VEGETABLE_FAT",
    title: "Chất béo thực vật",
    isRequired: false,
    unit: "g",
  },
  CHAT_BOT_DUONG: {
    id: 9,
    name: "STARCH_SUGAR",
    title: "Chất bột đường",
    isRequired: true,
    unit: "g",
  },
  CHAT_XO: {
    id: 10,
    name: "FIBER",
    title: "Chất xơ",
    isRequired: false,
    unit: "g",
  },
  MONO_UNSATURATED_FAT: {
    id: 20,
    name: "MONO_UNSATURATED_FAT",
    title: "Mono unsaturated fat",
    isRequired: false,
    unit: "g",
  },
  POLY_UNSATURATED_FAT: {
    id: 21,
    name: "POLY_UNSATURATED_FAT",
    title: "Poly unsaturated fat",
    isRequired: false,
    unit: "g",
  },
  TOTAL_UNSATURATED_FAT: {
    id: 22,
    name: "TOTAL_UNSATURATED_FAT",
    title: "Total unsaturated fat",
    isRequired: false,
    unit: "g",
  },
  CHOLESTEROL: {
    id: 23,
    name: "CHOLESTEROL",
    title: "Cholesterol",
    isRequired: false,
    unit: "mg",
  },
  DUONG: {
    id: 24,
    name: "SUGAR",
    title: "Đường",
    isRequired: false,
    unit: "g",
  },
};

export default FOOD_NUTRIENTS;
