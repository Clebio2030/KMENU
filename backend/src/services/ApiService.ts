import axios from 'axios';
import AuthService from './ApiAuthService'; // Serviço de autenticação para obter o token

const API_BASE_URL = 'https://sandboxapicore.imaginasoft.pt/api/v1';

class ApiService {
  private static async getAuthToken(): Promise<string> {
    return await AuthService.getAuthToken(); // Obter o token de autenticação
  }

  // Endpoint para autenticação (já implementado no AuthService)
  // ...

  // Endpoint para obter todos os usuários
  public static async getUsers(): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users: ' + error.message);
    }
  }

  // Endpoint para obter um usuário por ID
  public static async getUserById(id: string): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user by ID: ' + error.message);
    }
  }

  // Endpoint para criar um novo usuário
  public static async createUser(userData: any): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message);
    }
  }

  // Endpoint para atualizar um usuário
  public static async updateUser(id: string, userData: any): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user: ' + error.message);
    }
  }

  // Endpoint para deletar um usuário
  public static async deleteUser(id: string): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user: ' + error.message);
    }
  }

  // Endpoint para obter todos os produtos
  public static async getProducts(): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);
    }
  }

  // Endpoint para obter um produto por ID
  public static async getProductById(id: string): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product by ID: ' + error.message);
    }
  }

  // Endpoint para criar um novo produto
  public static async createProduct(productData: any): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create product: ' + error.message);
    }
  }

  // Endpoint para atualizar um produto
  public static async updateProduct(id: string, productData: any): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message);
    }
  }

  // Endpoint para deletar um produto
  public static async deleteProduct(id: string): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete product: ' + error.message);
    }
  }
}

export default ApiService;