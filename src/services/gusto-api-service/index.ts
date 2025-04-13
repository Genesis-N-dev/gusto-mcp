import { GustoEmbedded } from "@gusto/embedded-api";
import { GustoAuthService } from "../gusto-auth-service/index.js";
import { logger } from "../../helpers/logger.js";
import { PayrollTypes, ProcessingStatuses } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayrolls.js";

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

  async getAllPayrolls(uuid: string, options: {
    processingStatus?: ProcessingStatuses[];
    payrollTypes?: PayrollTypes[];
    startDate?: string;
    endDate?: string;
  } ) {
    try {
      const payrolls = await this.gustoClient.payrolls.list({
        companyId: uuid,
        processingStatuses: options.processingStatus,
        payrollTypes: options.payrollTypes,
        startDate: options.startDate,
        endDate: options.endDate,
      });
      logger.info("[Gusto] Payrolls:", payrolls);
      return {
        error: false,
        data: payrolls,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching payrolls:", error);
      return {
        error: true,
        data: 'Failed to fetch payrolls',
      }
    }
  }

  async getPayRoll(companyUuid: string, payroll: string) {
    try {
      const payrollInfo = await this.gustoClient.payrolls.get({
        companyId: companyUuid,
        payrollId: payroll,
      });
      logger.info("[Gusto] Payroll Info:", payrollInfo);
      return {
        error: false,
        data: payrollInfo,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching payroll info:", error);
      return {
        error: true,
        data: 'Failed to fetch payroll info',
      }
    }
  }

  async getPaySchedulesForCompany(uuid: string) {
    try {
      const paySchedules = await this.gustoClient.paySchedules.getAll({
        companyId: uuid,
      });
      logger.info("[Gusto] Pay Schedules:", paySchedules);
      return {
        error: false,
        data: paySchedules,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching pay schedules:", error);
      return {
        error: true,
        data: 'Failed to fetch pay schedules',
      }
    }
  }

  async getPaySchedule(uuid: string, payScheduleId: string) {
    try {
      const paySchedule = await this.gustoClient.paySchedules.get({
        companyId: uuid,
        payScheduleId: payScheduleId,
      });
      logger.info("[Gusto] Pay Schedule Info:", paySchedule);
      return {
        error: false,
        data: paySchedule,
      };
    } catch (error) {
      logger.error("[Gusto] Error fetching pay schedule info:", error);
      return {
        error: true,
        data: 'Failed to fetch pay schedule info',
      }
    }
  } 
  
}