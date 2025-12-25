export interface ConclusionRecommendation {
  id?: number;
  ID?: number;
  model?: string;
  MODEL?: string;
  ageType?: string;
  AGE_TYPE?: string;
  gender?: string;
  GENDER?: string;
  indicatorFrom?: string;
  INDICATOR_FROM?: string;
  valueFrom?: number;
  VALUE_FROM?: number;
  valueTo?: number;
  VALUE_TO?: number;
  indicatorTo?: string;
  INDICATOR_TO?: string;
  valueOneFrom?: number;
  VALUE_ONE_FROM?: number;
  valueOneTo?: number;
  VALUE_ONE_TO?: number;
  type?: string;
  TYPE?: string;
  conclusion?: string;
  CONCLUSION?: string;
  recommend?: string;
  RECOMMEND?: string;
  indicatorAnd?: string;
  INDICATOR_AND?: string;
  createdAt?: string;
  CREATED_DATE?: string;
  updatedAt?: string;
  MODIFIED_DATE?: string;
}

export interface CreateConclusionRecommendationDto {
  key: string;
  title: string;
  minValue: number;
  maxValue: number;
  conclusion: string;
  recommendation: string;
  level: "LOW" | "NORMAL" | "HIGH" | "VERY_HIGH";
}

export interface UpdateConclusionRecommendationDto {
  title?: string;
  minValue?: number;
  maxValue?: number;
  conclusion?: string;
  recommendation?: string;
  level?: "LOW" | "NORMAL" | "HIGH" | "VERY_HIGH";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    error?: string;
    statusCode: number;
  };
}
