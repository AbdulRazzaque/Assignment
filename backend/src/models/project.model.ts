import mongoose, { Document, Schema, Model } from 'mongoose';

export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';

export interface IProjectDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  dueDate?: Date | null;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [1, 'Project name cannot be empty'],
      maxlength: [80, 'Project name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#7C3AED',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_HOLD', 'COMPLETED'],
      default: 'ACTIVE',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

ProjectSchema.index({ userId: 1, createdAt: -1 });

export const Project: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
