import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { TodosAccess } from "../../dataLayer/todosAccess";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("deleteTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  logger.info(`User ${userId} is deleting todo ${todoId}`);

  await new TodosAccess().deleteTodoById(userId, todoId);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({}),
  };
};
