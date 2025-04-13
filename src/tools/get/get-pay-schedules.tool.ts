import { GetV1CompaniesCompanyIdPaySchedulesResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayschedules.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";
import { z } from "zod";
import { PayScheduleList } from "@gusto/embedded-api/models/components/payschedulelist.js";

const getPaySchedulesTool = CreateTool(
    "get-pay-schedules",
    `Retrieves information about a company’s pay schedule, including frequency, anchor dates, monthly pay days, and assignment status. 
    Also indicates whether Autopilot is enabled and whether the schedule is currently active or assigned to employees`,
    {
        uuid: z.string().describe("UUID of the company to get information about"),
    },
    async (args) => {
        const gustoApiService = GustoApiService.getInstance();
        const paySchedules = await gustoApiService.getPaySchedulesForCompany(args.uuid);

        if (paySchedules.error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${paySchedules.data}`,
                    },
                ],
            };
        }
        const paySchedulesList = paySchedules.data as GetV1CompaniesCompanyIdPaySchedulesResponse;

        const paySchedulesText = paySchedulesList.payScheduleList?.map(schedule => formatPaySchedule(schedule)).join("\n\n") || "No pay schedules found.";

        return {
            content: [
                {
                    type: "text",
                    text: paySchedulesText,
                },
            ],
        };
    }
)

const formatPaySchedule = (paySchedule: PayScheduleList) => {
    // Convert from snake_case to camelCase for properties that need it
    const schedule = {
      frequency: paySchedule.frequency,
      anchorPayDate: paySchedule.anchorPayDate,
      anchorEndOfPayPeriod: paySchedule.anchorEndOfPayPeriod,
      day1: paySchedule.day1,
      day2: paySchedule.day2,
      name: paySchedule.name,
      customName: paySchedule.customName,
      autoPilot: paySchedule.autoPilot,
      active: paySchedule.active
    };
    
    // Format the pay schedule details
    return `Pay Schedule Information:
    Name: ${schedule.name}
    Custom Name: ${schedule.customName}
    Frequency: ${schedule.frequency}
    Anchor Pay Date: ${schedule.anchorPayDate}
    Anchor End of Pay Period: ${schedule.anchorEndOfPayPeriod}
    Pay Days: ${schedule.day1} and ${schedule.day2} of the month
    Auto Pilot: ${schedule.autoPilot ? "Enabled" : "Disabled"}
    Status: ${schedule.active ? "Active" : "Inactive"}`;
};

export default getPaySchedulesTool;
