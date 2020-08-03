import "source-map-support/register";
import { getUserId } from "../utils";
import { getAllTodos } from "../../businessLogic/todos";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { S3Helper } from "../../helpers/s3Helper";

const logger = createLogger("getTodos");
const s3Helper = new S3Helper();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const user = getUserId(event);
  const items = await getAllTodos(user);

  logger.info(`create group for user ${user}`);

  for (const item of items) {
    item.attachmentUrl = await s3Helper.getTodoAttachmentUrl(item.todoId);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      items,
    }),
  };
};
