import {
  ConclusionRecommendationKey,
  ConclusionRecommendationAgeKey,
} from "@/enums/conclusion-recommendation-key";

export const isKeyGenderRelated = (
  key: ConclusionRecommendationKey
): boolean => {
  const genderRelatedKeys = [
    ConclusionRecommendationKey.LiverEnzymeSgot,
    ConclusionRecommendationKey.LiverEnzymeSgpt,
    ConclusionRecommendationKey.Creatinine,
    ConclusionRecommendationKey.UricAcid,
    ConclusionRecommendationKey.BMI,
    ConclusionRecommendationKey.HeightLength,
    ConclusionRecommendationKey.Weight,
  ];
  return genderRelatedKeys.includes(key);
};

export const isKeyAgeRelated = (key: ConclusionRecommendationKey): boolean => {
  const ageRelatedKeys = [ConclusionRecommendationKey.BMI];
  return ageRelatedKeys.includes(key);
};

export const isShowBMIIndiCatorRelated = (ageType: string): boolean => {
  return ["FROM_20_LESS_THEN_70", "EQUAL_MORE_THAN_70"].includes(ageType);
};

export const valueSelectedModelOne = (
  key: ConclusionRecommendationKey
): { label: string; unit: string } => {
  switch (key) {
    case ConclusionRecommendationKey.BloodPressureClinic:
      return { label: "Chỉ số tâm thu", unit: "mmHg" };
    case ConclusionRecommendationKey.BloodPressureHome:
      return { label: "Chỉ số tâm thu", unit: "mmHg" };
    case ConclusionRecommendationKey.BloodSugarFasting:
      return { label: "Chỉ số glucose huyết tương khi đói", unit: "mmol/L" };
    case ConclusionRecommendationKey.BloodSugar2H:
      return { label: "Chỉ số glucose huyết tương sau 2 giờ", unit: "mmol/L" };
    case ConclusionRecommendationKey.BloodSugarHbA1c:
      return { label: "Chỉ số HbA1c", unit: "%" };
    case ConclusionRecommendationKey.LiverEnzymeSgot:
      return { label: "Chỉ số SGOT/AST", unit: "U/L" };
    case ConclusionRecommendationKey.LiverEnzymeSgpt:
      return { label: "Chỉ số SGPT/ALT", unit: "U/L" };
    case ConclusionRecommendationKey.LipidCholesterol:
      return { label: "Chỉ số Cholesterol", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidLdl:
      return { label: "Chỉ số LDL", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidHdl:
      return { label: "Chỉ số HDL", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidTriglyceride:
      return { label: "Chỉ số Triglyceride", unit: "mmol/L" };
    case ConclusionRecommendationKey.Urea:
      return { label: "Chỉ số Ure", unit: "mmol/L" };
    case ConclusionRecommendationKey.BMI:
      return { label: "Chỉ số BMI", unit: "kg/m2" };
    case ConclusionRecommendationKey.Creatinine:
      return { label: "Chỉ số Creatinine", unit: "µmol/L" };
    case ConclusionRecommendationKey.UricAcid:
      return { label: "Chỉ số Axit Uric", unit: "µmol/L" };
    default:
      return { label: "Chỉ số tâm thu", unit: "mmHg" };
  }
};

export const valueSelectedModelTwo = (
  key: ConclusionRecommendationKey
): { label: string; unit: string } => {
  switch (key) {
    case ConclusionRecommendationKey.BloodPressureClinic:
      return { label: "Chỉ số tâm trương", unit: "mmHg" };
    case ConclusionRecommendationKey.BloodPressureHome:
      return { label: "Chỉ số tâm trương", unit: "mmHg" };
    case ConclusionRecommendationKey.BloodSugarFasting:
      return { label: "Chỉ số glucose huyết tương khi đói", unit: "mmol/L" };
    case ConclusionRecommendationKey.BloodSugar2H:
      return { label: "Chỉ số glucose huyết tương sau 2 giờ", unit: "mmol/L" };
    case ConclusionRecommendationKey.BloodSugarHbA1c:
      return { label: "Chỉ số HbA1c", unit: "%" };
    case ConclusionRecommendationKey.LiverEnzymeSgot:
      return { label: "Chỉ số SGOT/AST", unit: "U/L" };
    case ConclusionRecommendationKey.LiverEnzymeSgpt:
      return { label: "Chỉ số SGPT/ALT", unit: "U/L" };
    case ConclusionRecommendationKey.LipidCholesterol:
      return { label: "Chỉ số Cholesterol", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidLdl:
      return { label: "Chỉ số LDL", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidHdl:
      return { label: "Chỉ số HDL", unit: "mmol/L" };
    case ConclusionRecommendationKey.LipidTriglyceride:
      return { label: "Chỉ số Triglyceride", unit: "mmol/L" };
    case ConclusionRecommendationKey.Urea:
      return { label: "Chỉ số Ure", unit: "mmol/L" };
    case ConclusionRecommendationKey.Creatinine:
      return { label: "Chỉ số Creatinine", unit: "µmol/L" };
    case ConclusionRecommendationKey.UricAcid:
      return { label: "Chỉ số Axit Uric", unit: "µmol/L" };
    default:
      return { label: "Chỉ số tâm thu", unit: "mmHg" };
  }
};

export const bloodPressureInput = (
  key: ConclusionRecommendationKey
): boolean => {
  return (
    key === ConclusionRecommendationKey.BloodPressureClinic ||
    key === ConclusionRecommendationKey.BloodPressureHome
  );
};

export const isIndicatorOne = (key: ConclusionRecommendationKey): boolean => {
  const genderRelatedKeys = [
    ConclusionRecommendationKey.BloodPressureClinic,
    ConclusionRecommendationKey.BloodPressureHome,
    ConclusionRecommendationKey.LiverEnzymeSgot,
    ConclusionRecommendationKey.LiverEnzymeSgpt,
    ConclusionRecommendationKey.Creatinine,
    ConclusionRecommendationKey.UricAcid,
    ConclusionRecommendationKey.BloodSugarFasting,
    ConclusionRecommendationKey.BloodSugar2H,
    ConclusionRecommendationKey.BloodSugarHbA1c,
    ConclusionRecommendationKey.LipidCholesterol,
    ConclusionRecommendationKey.LipidLdl,
    ConclusionRecommendationKey.LipidHdl,
    ConclusionRecommendationKey.LipidTriglyceride,
    ConclusionRecommendationKey.Urea,
  ];
  return genderRelatedKeys.includes(key);
};

export const isAgeOptionForType = (
  key: ConclusionRecommendationKey
): boolean => {
  const genderRelatedKeys = [ConclusionRecommendationKey.HeightWeightUnder5];
  return genderRelatedKeys.includes(key);
};

export const isIndicatorTwo = (key: ConclusionRecommendationKey): boolean => {
  const genderRelatedKeys = [
    ConclusionRecommendationKey.BloodPressureClinic,
    ConclusionRecommendationKey.BloodPressureHome,
  ];
  return genderRelatedKeys.includes(key);
};

export const excludeOptionAgeRelated = (
  key: ConclusionRecommendationKey
): boolean => {
  const optionAgeRelatedKeys = [
    ConclusionRecommendationKey.BMI,
    ConclusionRecommendationKey.Weight,
    ConclusionRecommendationKey.HeightLength,
  ];
  return optionAgeRelatedKeys.includes(key);
};

export const excludeClassifyAndIndexRelated = (
  key: ConclusionRecommendationKey
): boolean => {
  const optionAgeRelatedKeys = [ConclusionRecommendationKey.BMI];
  return optionAgeRelatedKeys.includes(key);
};

export const optionAgeType = (key: ConclusionRecommendationAgeKey): boolean => {
  const optionTypeBMIKeys = [
    ConclusionRecommendationAgeKey.FROM_20_LESS_THEN_70,
    ConclusionRecommendationAgeKey.EQUAL_MORE_THAN_70,
  ];
  return optionTypeBMIKeys.includes(key);
};

export const excludeOptionAgeBabyRelated = (
  key: ConclusionRecommendationKey
): boolean => {
  const optionAgeRelatedKeys = [ConclusionRecommendationKey.WeightForHeight];
  return optionAgeRelatedKeys.includes(key);
};

export const notShowAge = (key: ConclusionRecommendationKey): boolean => {
  const keyAge = [ConclusionRecommendationKey.HeightLength];
  return keyAge.includes(key);
};
