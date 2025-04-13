import { GetV1CompaniesCompanyIdPayrollsResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayrolls.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";
import { z } from "zod";

const getPayrollsTool = CreateTool(
    "get-payrolls",
    `Retrieves detailed all payroll information for a company, including payroll deadlines, check dates, processing status, and calculated financial totals. 
    Also includes status metadata such as cancellation eligibility, submission blockers, credit blockers, and reasons for any changes in processing speed.`,
    {
        uuid: z.string().describe("UUID of the company to get information about"),
        processingStatuses: z.array(z.enum(['processed', 'unprocessed'])).optional().describe("Processing statuses to filter payrolls"),
        payrollTypes: z.array(z.enum(['regular', 'off_cycle'])).optional().describe("Payroll types to filter payrolls"),
        startDate: z.string().optional().describe("Start date to filter payrolls"),
        endDate: z.string().optional().describe("End date to filter payrolls"),
    },
    async (args) => {
        const gustoApiService = GustoApiService.getInstance();
        const payrolls = await gustoApiService.getAllPayrolls(args.uuid, {
            processingStatus: args.processingStatuses,
            payrollTypes: args.payrollTypes,
            startDate: args.startDate,
            endDate: args.endDate,
        });

        if (payrolls.error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${payrolls.data}`,
                    },
                ],
            };
        }
        const payrollsList = payrolls.data as GetV1CompaniesCompanyIdPayrollsResponse;
        const payrollsText = payrollsList.payrollList?.map((payroll) => {
            // Determine payroll type based on off_cycle flag
            const type = payroll.offCycle ? "Off-Cycle" : "Regular";
            
            // Determine status based on processed flag
            const status = payroll.processed ? "Processed" : "Pending";
            
            // Format pay period dates
            const payPeriod = payroll.payPeriod 
                ? `${payroll.payPeriod.startDate} to ${payroll.payPeriod.endDate}` 
                : "No pay period defined";
            
            // Get or format dates and times
            const checkDate = payroll.checkDate || "Not scheduled";
            const processedDate = payroll.processedDate || "Not processed";
            const calculatedAt = payroll.calculatedAt || "Not calculated";
            const createdAt = payroll.calculatedAt || "Unknown";
            const payrollDeadline = payroll.payrollDeadline || "No deadline";
            
            // Format financial details if available
            let financialDetails = "";
            if (payroll.totals) {
                const t = payroll.totals;
                financialDetails = `
            Financial Details:
              Gross Pay: ${t.grossPay}
              Net Pay: ${t.netPay}
              Employee Taxes: ${t.employeeTaxes}
              Employer Taxes: ${t.employerTaxes}
              Employee Commissions: ${t.employeeCommissions}
              Employee Benefits Deductions: ${t.employeeBenefitsDeductions}
              Other Deductions: ${t.otherDeductions}
              Check Amount: ${t.checkAmount}`;
            }
            
            return `Payroll Information:
          Pay Period: ${payPeriod}
          Type: ${type}
          Status: ${status}
          External: ${payroll.external ? "Yes" : "No"}
          Check Date: ${checkDate}
          Created At: ${createdAt}
          Processed Date: ${processedDate}
          Calculated At: ${calculatedAt}
          Payroll Deadline: ${payrollDeadline}${financialDetails}`;
        }).join("\n\n");
        return {
            content: [
                {
                    type: "text",
                    text: payrollsText || "Data not available",
                },
            ],
        };
    }
)

export default getPayrollsTool;