import { GetV1CompaniesCompanyIdPayrollsPayrollIdResponse } from '@gusto/embedded-api/models/operations/getv1companiescompanyidpayrollspayrollid.js';
import { CreateTool } from '../../helpers/create-tool.js';
import { GustoApiService } from '../../services/gusto-api-service/index.js';
import { z } from 'zod';
import { Payroll } from '@gusto/embedded-api/models/components/payroll.js';
import { generatePayrollText } from '../../helpers/formatters.js';

const getPayrollTool = CreateTool(
  'get-payroll',
  `Retrieves detailed payroll information for a specific payroll, including payroll deadlines, check dates, processing status, and calculated financial totals. 
    Also includes status metadata such as cancellation eligibility, submission blockers, credit blockers, and reasons for any changes in processing speed.`,
  {
    uuid: z.string().describe('UUID of the company to get information about'),
    payrollId: z.string().describe('ID of the payroll to get information about'),
  },
  async (args) => {
    const gustoApiService = GustoApiService.getInstance();
    const payroll = await gustoApiService.getPayRoll(args.uuid, args.payrollId);

    if (payroll.error) {
      return {
        content: [
          {
            type: 'text',
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
          type: 'text',
          text: payrollText,
        },
      ],
    };
  }
);

export default getPayrollTool;
