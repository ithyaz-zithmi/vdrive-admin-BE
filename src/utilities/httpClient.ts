import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import { logger } from '../shared/logger';

class HttpClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        ...config,
        headers: {
          ...this.getAuthHeaders(),
          ...config?.headers,
        },
      });
      logger.info(`GET ${this.baseURL}${endpoint} - Success`);
      return response;
    } catch (error: any) {
      logger.error(`GET ${this.baseURL}${endpoint} - Error: ${error.message}`);
      throw error;
    }
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        ...config,
        headers: {
          ...this.getAuthHeaders(),
          ...config?.headers,
        },
      });
      logger.info(`POST ${this.baseURL}${endpoint} - Success`);
      return response;
    } catch (error: any) {
      logger.error(`POST ${this.baseURL}${endpoint} - Error: ${error.message}`);
      throw error;
    }
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
        ...config,
        headers: {
          ...this.getAuthHeaders(),
          ...config?.headers,
        },
      });
      logger.info(`PUT ${this.baseURL}${endpoint} - Success`);
      return response;
    } catch (error: any) {
      logger.error(`PUT ${this.baseURL}${endpoint} - Error: ${error.message}`);
      throw error;
    }
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.patch(`${this.baseURL}${endpoint}`, data, {
        ...config,
        headers: {
          ...this.getAuthHeaders(),
          ...config?.headers,
        },
      });
      logger.info(`PATCH ${this.baseURL}${endpoint} - Success`);
      return response;
    } catch (error: any) {
      logger.error(`PATCH ${this.baseURL}${endpoint} - Error: ${error.message}`);
      throw error;
    }
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        ...config,
        headers: {
          ...this.getAuthHeaders(),
          ...config?.headers,
        },
      });
      logger.info(`DELETE ${this.baseURL}${endpoint} - Success`);
      return response;
    } catch (error: any) {
      logger.error(`DELETE ${this.baseURL}${endpoint} - Error: ${error.message}`);
      throw error;
    }
  }
}

// Create instance for user driver API
export const userDriverClient = new HttpClient(
  config.userDriverApiUrl,
  config.internalServiceApiKey
);

export default HttpClient;
