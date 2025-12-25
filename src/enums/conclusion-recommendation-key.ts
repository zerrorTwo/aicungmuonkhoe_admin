export enum ConclusionRecommendationKey {
  BloodPressure = "1",
  BloodPressureClinic = "1.1",
  BloodPressureHome = "1.2",

  BloodSugar = "2",
  BloodSugarFasting = "2.1",
  BloodSugar2H = "2.2",
  BloodSugarHbA1c = "2.3",

  LiverEnzyme = "3",
  LiverEnzymeSgot = "3.1",
  LiverEnzymeSgpt = "3.2",

  Lipid = "4",
  LipidCholesterol = "4.1",
  LipidLdl = "4.2",
  LipidHdl = "4.3",
  LipidTriglyceride = "4.4",

  UreaCreatinine = "5",
  Urea = "5.1",
  Creatinine = "5.2",

  UricAcid = "6",

  BMI = "7",

  HeightWeightUnder5 = "8",
  HeightLength = "8.1",
  Weight = "8.2",
  WeightForHeight = "8.3",
  Weight5To10 = "9",
  Height5To16 = "10",
}

export enum ConclusionRecommendationAgeKey {
  FROM_5_LESS_THAN_12 = "FROM_5_LESS_THAN_12",
  FROM_12_LESS_THAN_20 = "FROM_12_LESS_THAN_20",
  FROM_20_LESS_THEN_70 = "FROM_20_LESS_THEN_70",
  EQUAL_MORE_THAN_70 = "EQUAL_MORE_THAN_70",
}
