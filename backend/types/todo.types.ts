import { Types } from "mongoose";

export interface ITodo {
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  userId: Types.ObjectId;
}
