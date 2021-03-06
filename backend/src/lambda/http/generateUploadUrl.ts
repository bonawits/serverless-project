import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { S3Helper } from "../../helpers/s3Helper";

const logger = createLogger("generateUrlUpload");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  logger.info(`User ${userId} is generating url for todo ${todoId}`);

  const uploadUrl = await new S3Helper().getPresignedUrl(todoId);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ uploadUrl }),
  };
};
