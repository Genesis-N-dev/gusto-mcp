import { GetV1CompaniesCompanyIdEmployeesResponse } from '@gusto/embedded-api/models/operations/getv1companiescompanyidemployees.js';
import { CreateTool } from '../../helpers/create-tool.js';
import { GustoApiService } from '../../services/gusto-api-service/index.js';
import { z } from 'zod';
import { formatEmployee } from '../../helpers/formatters.js';

const getAllEmployeesTool = CreateTool(
  'get-all-employees',
  `Retrieves comprehensive employee details including personal and contact information, onboarding status, job and compensation history, paid time off policies, termination data, garnishments, 
    custom fields, and current employment status of all employees given filters. Useful for syncing employee records, verifying employment, or managing payroll-related workflows.`,
  {
    uuid: z.string().describe('UUID of the company to get information about'),
    terminated: z.boolean().optional().describe('Whether to include terminated employees'),
    searchTerm: z.string().optional().describe('Search term to filter employees'),
  },
  async (args) => {
    const gustoApiService = GustoApiService.getInstance();
    const employees = await gustoApiService.getEmployees(args.uuid, {
      terminated: args.terminated,
      searchTerm: args.searchTerm,
    });

    if (employees.error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${employees.data}`,
          },
        ],
      };
    }
    const employeesList = employees.data as GetV1CompaniesCompanyIdEmployeesResponse;
    const employeesText = employeesList.employeeList
      ?.map((employee) => formatEmployee(employee))
      .join('\n');
    return {
      content: [
        {
          type: 'text',
          text: employeesText ?? ('' as string),
        },
      ],
    };
  }
);

export default getAllEmployeesTool;
