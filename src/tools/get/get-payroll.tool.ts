import { GetV1CompaniesCompanyIdPayrollsPayrollIdResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayrollspayrollid.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";
import { z } from "zod";
import { Payroll } from "@gusto/embedded-api/models/components/payroll.js";

const getPayrollTool = CreateTool(
    "get-payroll",
    `Retrieves detailed payroll information for a specific payroll, including payroll deadlines, check dates, processing status, and calculated financial totals. 
    Also includes status metadata such as cancellation eligibility, submission blockers, credit blockers, and reasons for any changes in processing speed.`,
    {
        uuid: z.string().describe("UUID of the company to get information about"),
        payrollId: z.string().describe("ID of the payroll to get information about"),
    },
    async (args) => {
        const gustoApiService = GustoApiService.getInstance();
        const payroll = await gustoApiService.getPayRoll(args.uuid, args.payrollId);

        if (payroll.error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${payroll.data}`,
                    },
                ],
            };
        }
        const payrollDetails = payroll.data as GetV1CompaniesCompanyIdPayrollsPayrollIdResponse;
        const payrollText = generatePayrollText(payrollDetails.payroll as Payroll);
        
        return {
            content: [
                {
                    type: "text",
                    text: payrollText,
                },
            ],
        };
    }
)

const generatePayrollText = (payroll: Payroll) => {
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
}

export default getPayrollTool;