import { TodoItem } from "../models/todoItem";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { CreateTodoRequest } from "../requests/createTodoRequest";
import uuid from "uuid/v4";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("todosAccess");

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME,
    private readonly userIndex = process.env.USER_ID_INDEX
  ) {}

  async getUserTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`table name: ${this.todosTable}`);
    logger.info(`index name: ${this.indexName}`);
    logger.info(`user id: ${userId}`);
    logger.info(`user index: ${this.userIndex}`);

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.indexName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return result.Items as TodoItem[];
  }

  async createTodo(
    request: CreateTodoRequest,
    userId: string
  ): Promise<TodoItem> {
    const newId = uuid();
    const item: TodoItem = {
      userId: userId,
      todoId: newId,
      createdAt: new Date().toISOString(),
      name: request.name,
      dueDate: request.dueDate,
      done: false,
    };

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: item,
      })
      .promise();

    return item;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
