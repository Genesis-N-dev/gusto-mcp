import { GetV1TokenInfoResponse } from '@gusto/embedded-api/models/operations/getv1tokeninfo.js';
import { CreateTool } from '../../helpers/create-tool.js';
import { GustoApiService } from '../../services/gusto-api-service/index.js';
import { z } from 'zod';

const getCompanyDetailsTool = CreateTool(
  'get-company-information',
  `Get information about the company using the UUID returned from the get-token-information tool.`,
  {
    uuid: z.string().describe('UUID of the company to get information about'),
  },
  async (args) => {
    const gustoApiService = GustoApiService.getInstance();
    const companyInfo = await gustoApiService.getCompanyInfo(args.uuid);
    if (companyInfo.error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${companyInfo.data}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: `Company Info: ${JSON.stringify(companyInfo)}`,
        },
      ],
    };
  }
);

export default getCompanyDetailsTool;
