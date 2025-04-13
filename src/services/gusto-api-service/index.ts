import { GustoEmbedded } from "@gusto/embedded-api";
import { GustoAuthService } from "../gusto-auth-service/index.js";
import { logger } from "../../helpers/logger.js";

export class GustoApiService {
  private static instance: GustoApiService;
  private gustoClient: GustoEmbedded;

  private constructor() {
    this.gustoClient = new GustoEmbedded({
      companyAccessAuth: GustoAuthService.getInstance().getAccessToken() as string,
      server: "demo",
    });
  }

  public static getInstance(): GustoApiService {
    if (!GustoApiService.instance) {
      GustoApiService.instance = new GustoApiService();
    }
    return GustoApiService.instance;
  }

   async getTokenInfo() {
    try {
      const tokenInfo = await this.gustoClient.introspection.getInfo({});
      logger.info("[Gusto] Token Info:", tokenInfo);
      return {
        error: false,
        data: tokenInfo,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching token info:", error);
      return {
        error: true,
        data: 'Failed to fetch token info',
      }
    }
   }

   async getCompanyInfo(uuid: string) {
    try {
      const companyInfo = await this.gustoClient.companies.get({
        companyId: uuid,
      });
      logger.info("[Gusto] Company Info:", companyInfo);
        return {
            error: false,
            data: companyInfo,
        };
    } catch (error) {
        logger.error("[Gusto] Error fetching company info:", error);
        return {
            error: true,
            data: 'Failed to fetch company info',
        }
    }
   }

   async getAllAdmins(uuid: string) {
    try {
      const admins = await this.gustoClient.companies.listAdmins({
        companyId: uuid
      });
      logger.info("[Gusto] Admins:", admins);
      return {
        error: false,
        data: admins,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching admins:", error);
      return {
        error: true,
        data: 'Failed to fetch admins',
      }
    }
  }
  
}