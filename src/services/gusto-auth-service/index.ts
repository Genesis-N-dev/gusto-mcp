import dotenv from 'dotenv';
import axios from 'axios';
import { logger } from '../../helpers/logger.js'; // assuming logger is in utils

dotenv.config();

const GUSTO_API_URL = process.env.GUSTO_BASE_URL;
const GUSTO_CLIENT_ID = process.env.GUSTO_CLIENT_ID;
const GUSTO_CLIENT_SECRET = process.env.GUSTO_CLIENT_SECRET;
const GUSTO_INITIAL_ACCESS_TOKEN = process.env.GUSTO_ACCESS_TOKEN;
const GUSTO_REFRESH_TOKEN = process.env.GUSTO_REFRESH_TOKEN;

if (!GUSTO_API_URL || !GUSTO_CLIENT_ID || !GUSTO_CLIENT_SECRET || !GUSTO_REFRESH_TOKEN) {
  throw new Error("Missing required Gusto environment variables");
}

export class GustoAuthService {
  private static instance: GustoAuthService;
  private accessToken: string | null = GUSTO_INITIAL_ACCESS_TOKEN ?? null;
  private refreshToken: string = GUSTO_REFRESH_TOKEN ?? '';
  private tokenExpiry: number = 0;
  private refreshInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): GustoAuthService {
    if (!GustoAuthService.instance) {
      GustoAuthService.instance = new GustoAuthService();
    }
    return GustoAuthService.instance;
  }

  public async authenticate(): Promise<void> {
    try {
      logger.info("[Gusto] Refreshing company access token...");

      const response = await axios.post(`${GUSTO_API_URL}/oauth/token`, {
        client_id: GUSTO_CLIENT_ID,
        client_secret: GUSTO_CLIENT_SECRET,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      });

      const { access_token, expires_in, refresh_token } = response.data;

      this.accessToken = access_token;
      this.refreshToken = refresh_token ?? this.refreshToken;
      this.tokenExpiry = Date.now() + expires_in * 1000;

      this.stopAutoRefresh();

      logger.info("[Gusto] Company token refreshed successfully.");
      this.setupAutoRefresh(expires_in);
    } catch (error: any) {
      logger.error(`[Gusto] Token refresh failed: ${error.message}`);
      throw new Error("Gusto authentication failed");
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  private setupAutoRefresh(expiresIn: number): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    const refreshTime = Math.min(expiresIn - 120, 7200) * 1000; // refresh 2 mins before expiry

    this.refreshInterval = setInterval(async () => {
      try {
        await this.authenticate();
      } catch (err) {
        logger.error("[Gusto] Auto-refresh failed", err);
      }
    }, refreshTime);
  }

  public stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
