import mongoose, { Document, Schema, Model } from 'mongoose';
import { TaskPriority, TaskStatus } from '../types';

export interface ISubtask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
}

export interface ITaskDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  tags: string[];
  projectId?: mongoose.Types.ObjectId | null;
  subtasks: ISubtask[];
  dueDate: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        message: '{VALUE} is not a valid task status',
      },
      default: 'TODO',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH'],
        message: '{VALUE} is not a valid task priority',
      },
      default: 'MEDIUM',
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [50, 'Category cannot exceed 50 characters'],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for high-performance querying and analytics
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, projectId: 1 });
TaskSchema.index({ userId: 1, tags: 1 });

export const Task: Model<ITaskDocument> =
  mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);
