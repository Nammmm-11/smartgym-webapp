import { apiClient } from '../../../api/client';

export interface GymPackageDto {
  id?: string;
  name?: string;
  description?: string;
  durationInMonths: number;
  price: number;
  isActive: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;   
}

export interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  message?: string | null;
  error?: any;
}

// Khớp chuẩn với route api/web-app/v{version}/gym-packages (với v1)
const BASE_PATH = '/web-app/v1/gym-packages';

export const gymPackageService = {
  // 1. GetList khớp với [HttpGet] và nhận các query params phân trang
  getAll: async (pageIndex: number = 1, pageSize: number = 20): Promise<ApiResult<PaginatedResult<GymPackageDto>>> => {
    try {
      const response = await apiClient.get(BASE_PATH, {
        params: { pageIndex, pageSize }
      });
      if (response.data && response.data.isSuccess) {
        return response.data;
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu gói tập từ SQL Server:", err);
    }

    return {
      isSuccess: true,
      data: {
        items: [],
        totalCount: 0,
        pageIndex: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      }
    };
  },

  // 2. GetById (Lưu ý: Nếu Controller của bạn chưa có [HttpGet("{id}")] thì cần bổ sung ở backend, hiện tại trỏ tạm theo chuẩn REST)
  getById: async (id: string): Promise<ApiResult<GymPackageDto>> => {
    const response = await apiClient.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  // 3. Create khớp với [HttpPost]
  create: async (data: Omit<GymPackageDto, 'id'>): Promise<ApiResult<GymPackageDto>> => {
    const response = await apiClient.post(BASE_PATH, data);
    return response.data;
  },

  // 4. Update khớp với [HttpPut("{id}")]
  update: async (id: string, data: Partial<GymPackageDto>): Promise<ApiResult<GymPackageDto>> => {
    const response = await apiClient.put(`${BASE_PATH}/${id}`, { id, ...data });
    return response.data;
  },

  // 5. Delete khớp với [HttpDelete] nhận dữ liệu qua body (DeleteGymPackageRequest)
  delete: async (id: string): Promise<ApiResult<boolean>> => {
    const response = await apiClient.delete(BASE_PATH, {
      data: { id } // Khớp với [FromBody] DeleteGymPackageRequest ở C#
    });
    return response.data;
  }
};