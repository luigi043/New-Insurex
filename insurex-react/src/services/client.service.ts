import api from './api';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  taxId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export const clientService = {
  async getClients(page: number = 1, pageSize: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
    });
    const response = await api.get(`/clients?${params}`);
    return response.data;
  },

  async getClient(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async createClient(data: Partial<Client>): Promise<Client> {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  async searchClients(query: string): Promise<Client[]> {
    const response = await api.get<Client[]>(`/clients/search?q=${query}`);
    return response.data;
  },
};
