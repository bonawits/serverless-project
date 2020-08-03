import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";
import { TodosAccess } from "../../dataLayer/todosAccess";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  const userId = getUserId(event);
  logger.info(`event: ${event}`);
  logger.info(`userId: ${userId}`);
  const item = await new TodosAccess().createTodo(newTodo, userId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      item,
    }),
  };
};
