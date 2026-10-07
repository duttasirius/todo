export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Todo["priority"];
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Todo["priority"];
  dueDate?: string;
}
