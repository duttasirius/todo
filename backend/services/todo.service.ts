import { Todo } from "../models/todo.model.js";

export const createTodo = async (userId: string, data: Record<string, unknown>) => {
  return Todo.create({ ...data, userId });
};

export const getTodos = async (userId: string) => {
  return Todo.find({ userId }).sort({ createdAt: -1 });
};

export const getTodoById = async (userId: string, todoId: string) => {
  return Todo.findOne({ _id: todoId, userId });
};

export const updateTodo = async (
  userId: string,
  todoId: string,
  data: Record<string, unknown>,
) => {
  return Todo.findOneAndUpdate(
    { _id: todoId, userId },
    data,
    { new: true, runValidators: true },
  );
};

export const deleteTodo = async (userId: string, todoId: string) => {
  return Todo.findOneAndDelete({ _id: todoId, userId });
};
