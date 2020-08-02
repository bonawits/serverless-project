import "source-map-support/register";
import { getUserId } from "../utils";
import { getAllTodos } from "../../businessLogic/todos";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { createLogger } from "../../utils/logger";

const logger = createLogger("getTodos");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const user = getUserId(event);
  const items = await getAllTodos(user);

  logger.info(`create group for user ${user}`);

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
