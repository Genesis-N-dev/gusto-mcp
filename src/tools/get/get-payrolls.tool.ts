import { GetV1CompaniesCompanyIdPayrollsResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayrolls.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";
import { z } from "zod";
import { generatePayrollText } from "../../helpers/formatters.js";

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
        const payrollsText = payrollsList.payrollList?.map((payroll) => generatePayrollText(payroll)).join("\n\n");
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