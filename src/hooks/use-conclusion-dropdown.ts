/**
 * Static dropdown data for conclusion form
 * This replaces the backend dropdown endpoint with static data
 */

export interface DropdownOption {
  code: string;
  name: string;
  type: string;
}

// Age type options
export const AGE_TYPE_OPTIONS: DropdownOption[] = [
  {
    code: "FROM_0_LESS_THAN_5",
    name: "Từ 0 đến dưới 5 tuổi",
    type: "AGE_TYPE",
  },
  {
    code: "FROM_5_LESS_THAN_12",
    name: "Từ 5 đến dưới 12 tuổi",
    type: "AGE_TYPE",
  },
  {
    code: "FROM_12_LESS_THAN_20",
    name: "Từ 12 đến dưới 16 tuổi",
    type: "AGE_TYPE",
  },
  {
    code: "FROM_20_LESS_THEN_70",
    name: "Từ 20 đến dưới 70 tuổi",
    type: "AGE_TYPE",
  },
  { code: "EQUAL_MORE_THAN_70", name: "Từ 70 tuổi trở lên", type: "AGE_TYPE" },
];

// Indicator options (operators)
export const INDICATOR_OPTIONS: DropdownOption[] = [
  { code: "LESS_THAN", name: "<", type: "INDICATOR" },
  { code: "LESS_THAN_OR_EQUAL", name: "≤", type: "INDICATOR" },
  { code: "GREATER_THAN", name: ">", type: "INDICATOR" },
  { code: "GREATER_THAN_OR_EQUAL", name: "≥", type: "INDICATOR" },
  { code: "ABOUT", name: "Khoảng", type: "INDICATOR" },
];

// Classification type options
export const TYPE_OPTIONS: DropdownOption[] = [
  { code: "NORMAL", name: "Bình thường", type: "TYPE" },
  { code: "LOW", name: "Thấp", type: "TYPE" },
  { code: "HIGH", name: "Cao", type: "TYPE" },
  { code: "VERY_HIGH", name: "Rất cao", type: "TYPE" },
  { code: "RISK", name: "Nguy cơ", type: "TYPE" },
];

// BMI-specific type options
export const TYPE_1_OPTIONS: DropdownOption[] = [
  { code: "UNDERWEIGHT", name: "Thiếu cân", type: "TYPE_1" },
  { code: "NORMAL", name: "Bình thường", type: "TYPE_1" },
  { code: "OVERWEIGHT", name: "Thừa cân", type: "TYPE_1" },
  { code: "OBESE", name: "Béo phì", type: "TYPE_1" },
];

/**
 * Get all dropdown options
 */
export function getAllDropdownOptions(): DropdownOption[] {
  return [
    ...AGE_TYPE_OPTIONS,
    ...INDICATOR_OPTIONS,
    ...TYPE_OPTIONS,
    ...TYPE_1_OPTIONS,
  ];
}

/**
 * Get dropdown options by type
 */
export function getDropdownOptionsByType(type: string): DropdownOption[] {
  return getAllDropdownOptions().filter((option) => option.type === type);
}

/**
 * Custom hook for dropdown data
 * Provides static dropdown options without backend call
 */
export function useConclusionDropdown(_model?: string) {
  // Return all options - model parameter kept for compatibility
  return getAllDropdownOptions();
}
