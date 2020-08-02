import { TodosAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";

const todoAccess = new TodosAccess();

export async function getAllTodos(user: string): Promise<TodoItem[]> {
  return await todoAccess.getUserTodos(user);
}
