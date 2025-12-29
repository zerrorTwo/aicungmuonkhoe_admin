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

export interface User {
  USER_ID: number;
  PHONE: string;
  EMAIL: string;
  FULL_NAME?: string;
  PASSWORD?: string;
  START_TOUR?: boolean | null;
  STATUS_ACTIVE: number | null; // 1 | 0 | null
  IS_ADMIN: number; // 1 | 0
  IS_DELETED: number; // 1 | 0
  FACE_IMAGE?: string | null;
  CREATED_AT: string;
  UPDATED_AT: string;
  HEALTH_DOCUMENTS?: { FULL_NAME?: string; [key: string]: any }[]; // Updated to match response structure
  // Computed/Mapped properties (optional if we map them on frontend, but better to use raw if possible or map in component)
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  isAdmin?: number;
}

export interface UpdateUserDto {
  STATUS_ACTIVE?: number;
  IS_ADMIN?: number;
  EMAIL?: string;
  PHONE?: string;
  FULL_NAME?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: number;
  data: T;
  message?: string;
}

export interface PaginatedResult<T> {
  users: T[]; // Backend returns 'users' key in data
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface Banner {
  ID: number;
  IMAGE: string | null;
  TITLE: string;
  ACTIVE: boolean;
  CREATED_BY: number;
  UPDATED_BY: number;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export interface BannerQuery {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export interface CreateBannerDto {
  TITLE: string;
  IMAGE?: File;
  ACTIVE?: boolean;
}

export interface UpdateBannerDto {
  TITLE?: string;
  IMAGE?: File;
  ACTIVE?: boolean;
}

export interface PaginatedBannerResult {
  listData: Banner[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}

export interface LoginDto {
  EMAIL: string;
  PASSWORD?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  conversation_id: string;
}
