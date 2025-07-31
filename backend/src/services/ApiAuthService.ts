import axios from 'axios';

const API_BASE_URL = 'https://sandboxapicore.imaginasoft.pt/api/v1';
const USERNAME = 'sandboxapi_nsapi_266844693';
const PASSWORD = 'ieN83R8ilgqPu6RCEsUFdg9H22OzfKG2wjSoSsnt@AqYKsntqJIF&Ux2$2O1';

interface AuthResponse {
  token: string; // Certifique-se de que a API retorna o token neste formato
}

class AuthService {
  private static token: string | null = null; // Cache do token

  private static async fetchAuthToken(): Promise<string> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/Authentication`,
        {
          username: USERNAME,
          password: PASSWORD,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Verifique se o token foi retornado corretamente
      if (!response.data.token) {
        throw new Error('Token not found in the response');
      }

      return response.data.token;
    } catch (error) {
      // Melhore o tratamento de erros
      if (error.response) {
        // Erro retornado pela API
        throw new Error(
          `Failed to authenticate: ${error.response.status} - ${error.response.data.message || 'No error message'}`
        );
      } else if (error.request) {
        // Erro de conexão
        throw new Error('Failed to authenticate: No response received from the server');
      } else {
        // Erro genérico
        throw new Error('Failed to authenticate: ' + error.message);
      }
    }
  }

  public static async getAuthToken(): Promise<string> {
    // Se o token já estiver em cache, retorne-o
    if (this.token) {
      return this.token;
    }

    // Caso contrário, obtenha um novo token
    this.token = await this.fetchAuthToken();
    return this.token;
  }

  // Método para limpar o cache do token (útil para logout ou token expirado)
  public static clearToken(): void {
    this.token = null;
  }
}

export default AuthService;