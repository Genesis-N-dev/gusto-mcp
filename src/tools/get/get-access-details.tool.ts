import { GetV1TokenInfoResponse } from "@gusto/embedded-api/models/operations/getv1tokeninfo.js";
import { CreateTool } from "../../helpers/create-tool.js";
import { GustoApiService } from "../../services/gusto-api-service/index.js";


const getAccessDetailsTool = CreateTool(
    "get-token-information",
    `Get info about the current access token, Returns scope and resource information associated with the current access token.
    Resource type can be companu and uuid of the company is also returned`,
    {},
    async () => {
        const gustoApiService = GustoApiService.getInstance();
        const tokenInfo = await gustoApiService.getTokenInfo();
        if (tokenInfo.error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${tokenInfo.data}`,
                    },
                ]
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Token Info: ${JSON.stringify(tokenInfo)}`,
                },
                {
                    type: "text",
                    text: `Company UUID: ${(tokenInfo.data as GetV1TokenInfoResponse).object?.resource?.uuid}`,
                }
            ]
        }
    }
)

export default getAccessDetailsTool;