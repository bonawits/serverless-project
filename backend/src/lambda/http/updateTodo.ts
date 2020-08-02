import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { TodosAccess } from "../../dataLayer/todosAccess";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("updateTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  logger.info(`User ${userId} updating group ${todoId} to be ${updatedTodo}`);
  await new TodosAccess().updateTodo(userId, updatedTodo, todoId);
  return {
    statusCode: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({}),
  };
};
