import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config = environment;

  constructor() {}

  /**
   * Get the base API URL
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get a specific API endpoint
   */
  getApiEndpoint(endpoint: keyof typeof this.config.apiEndpoints): string {
    return `${this.config.apiUrl}${this.config.apiEndpoints[endpoint]}`;
  }

  /**
   * Get the full environment configuration
   */
  getEnvironment() {
    return this.config;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.config.production;
  }
}
