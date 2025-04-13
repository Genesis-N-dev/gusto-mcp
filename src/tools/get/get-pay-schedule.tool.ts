import { GetV1CompaniesCompanyIdPaySchedulesPayScheduleIdResponse } from "@gusto/embedded-api/models/operations/getv1companiescompanyidpayschedulespayscheduleid.js";
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
        scheduleId: z.string().describe("ID of the pay schedule to get information about"),
    },
    async (args) => {
        const gustoApiService = GustoApiService.getInstance();
        const paySchedules = await gustoApiService.getPaySchedule(args.uuid, args.scheduleId);

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
        const paySchedulesList = paySchedules.data as GetV1CompaniesCompanyIdPaySchedulesPayScheduleIdResponse;

        const paySchedulesText = paySchedulesList.payScheduleObject ? formatPaySchedule(paySchedulesList.payScheduleObject) : "No pay schedules found.";

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