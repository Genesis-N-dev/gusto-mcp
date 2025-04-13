import { GetV1EmployeesResponse } from '@gusto/embedded-api/models/operations/getv1employees.js';
import { CreateTool } from '../../helpers/create-tool.js';
import { GustoApiService } from '../../services/gusto-api-service/index.js';
import { z } from 'zod';
import { formatEmployee } from '../../helpers/formatters.js';

const getEmployeeTool = CreateTool(
  'get-employee',
  `Retrieves comprehensive employee details including personal and contact information, onboarding status, job and compensation history, paid time off policies, termination data,
     garnishments, custom fields, and current employment status. Useful for syncing employee records, verifying employment, or managing payroll-related workflows.`,
  {
    employeeId: z.string().describe('ID of the employee to get information about'),
  },
  async (args) => {
    const gustoApiService = GustoApiService.getInstance();
    const employee = await gustoApiService.getEmployee(args.employeeId);

    if (employee.error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${employee.data}`,
          },
        ],
      };
    }
    const employeeDetails = employee.data as GetV1EmployeesResponse;

    const employeeText = employeeDetails.employee
      ? formatEmployee(employeeDetails.employee)
      : 'No employee found.';

    return {
      content: [
        {
          type: 'text',
          text: employeeText,
        },
      ],
    };
  }
);

export default getEmployeeTool;
