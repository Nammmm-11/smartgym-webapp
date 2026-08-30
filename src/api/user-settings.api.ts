import { apiClient } from './client';

export const userSettingsApi = {
  getLanguage: async () => {
    const response = await apiClient.get('/web-app/v1/identities/users/settings/get-language');
    return response.data;
  },
  changeLanguage: async (languageCode: string) => {
    // Truyền body có chứa ngôn ngữ (ví dụ: 'VI', 'EN')
    const response = await apiClient.post('/web-app/v1/identities/users/settings/change-language', { languageCode });
    return response.data;
  }
};