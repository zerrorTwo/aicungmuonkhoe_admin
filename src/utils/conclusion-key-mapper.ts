import { ConclusionRecommendationKey } from "../enums/conclusion-recommendation-key";

// Map frontend keys to backend MODEL names
export const CONCLUSION_KEY_TO_MODEL: Record<string, string> = {
  // Blood Pressure
  [ConclusionRecommendationKey.BloodPressureClinic]: "HOSPITAL",
  [ConclusionRecommendationKey.BloodPressureHome]: "HOME",

  // Blood Sugar
  [ConclusionRecommendationKey.BloodSugarFasting]: "HUNGRY",
  [ConclusionRecommendationKey.BloodSugar2H]: "2_HOURS",
  [ConclusionRecommendationKey.BloodSugarHbA1c]: "HBA1C",

  // Liver Enzyme
  [ConclusionRecommendationKey.LiverEnzymeSgot]: "SGOT",
  [ConclusionRecommendationKey.LiverEnzymeSgpt]: "SGPT",

  // Lipid
  [ConclusionRecommendationKey.LipidCholesterol]: "CHOLESTEROL",
  [ConclusionRecommendationKey.LipidLdl]: "LDL",
  [ConclusionRecommendationKey.LipidHdl]: "HDL",
  [ConclusionRecommendationKey.LipidTriglyceride]: "TRIGLYCERIDE",

  // Urea Creatinine
  [ConclusionRecommendationKey.Urea]: "UREA",
  [ConclusionRecommendationKey.Creatinine]: "CREA",

  // Uric Acid
  [ConclusionRecommendationKey.UricAcid]: "ACID_URIC",

  // BMI
  [ConclusionRecommendationKey.BMI]: "BMI",

  // Height Weight Under 5
  [ConclusionRecommendationKey.HeightLength]: "HEIGHT",
  [ConclusionRecommendationKey.Weight]: "WEIGHT",
};

/**
 * Convert frontend key to backend model name
 * @param key - Frontend key (e.g., "2.2")
 * @returns Backend model name (e.g., "GLUCOSE_2H")
 */
export function keyToModel(key: string): string {
  return CONCLUSION_KEY_TO_MODEL[key] || key;
}
