import { GetV1CompaniesCompanyIdPaySchedulesResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayschedules.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";
import { z } from "zod";
import { formatPaySchedule } from "../../helpers/formatters.js";

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


export default getPaySchedulesTool;
