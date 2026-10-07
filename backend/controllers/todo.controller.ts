import type { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../services/todo.service.js";

const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

export const create = async (req: Request, res: Response) => {
  const { title, description, completed, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  try {
    const todo = await createTodo(res.locals.userId, {
      title: title.trim(),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create todo",
    });
  }
};

export const list = async (_req: Request, res: Response) => {
  try {
    const todos = await getTodos(res.locals.userId);

    return res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch todos",
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }

  try {
    const todo = await getTodoById(res.locals.userId, id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch todo",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }

  const { title, description, completed, priority, dueDate } = req.body;
  const data: Record<string, unknown> = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }
    data.title = title.trim();
  }

  if (description !== undefined) data.description = description;
  if (completed !== undefined) data.completed = completed;
  if (priority !== undefined) data.priority = priority;
  if (dueDate !== undefined) data.dueDate = dueDate;

  try {
    const todo = await updateTodo(res.locals.userId, id, data);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update todo",
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }

  try {
    const todo = await deleteTodo(res.locals.userId, id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete todo",
    });
  }
};
