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
