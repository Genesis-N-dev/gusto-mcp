import { CreateTool } from '../../helpers/create-tool.js';
import { GustoApiService } from '../../services/gusto-api-service/index.js';
import { z } from 'zod';
import { GetV1CompaniesCompanyIdAdminsResponse } from '@gusto/embedded-api/models/operations/getv1companiescompanyidadmins.js';

const getAllAdminsTool = CreateTool(
  'get-all-the-admins',
  `Get all the admins of the company`,
  {
    uuid: z.string().describe('UUID of the company to get information about'),
  },
  async (args) => {
    const gustoApiService = GustoApiService.getInstance();
    const admins = await gustoApiService.getAllAdmins(args.uuid);

    if (admins.error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${admins.data}`,
          },
        ],
      };
    }
    const adminsList = admins.data as GetV1CompaniesCompanyIdAdminsResponse;
    const adminsText = adminsList.adminList
      ?.map((admin) => {
        return `First name: ${admin.firstName}, Last name: ${admin.lastName}, Email: ${admin.email}`;
      })
      .join('\n');
    return {
      content: [
        {
          type: 'text',
          text: adminsText ?? ('' as string),
        },
      ],
    };
  }
);

export default getAllAdminsTool;
