export interface ConclusionRecommendation {
  id: number;
  model: string;
  ageType?: string;
  gender?: string;
  indicatorFrom?: string;
  valueFrom?: number;
  valueTo?: number;
  indicatorTo?: string;
  valueOneFrom?: number;
  valueOneTo?: number;
  type?: string;
  conclusion: string;
  recommend?: string;
  indicatorAnd?: string;
  createdAt?: string;
  updatedAt?: string;
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
