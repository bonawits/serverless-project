import { TodoItem } from "../models/todoItem";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

export class TodosAccess {
  constructor(
    XAWS = AWSXRay.captureAWS(AWS),
    private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODO_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getUserTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return result.Items as TodoItem[];
  }
}
