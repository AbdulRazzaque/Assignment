import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITagDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  color: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      minlength: [1, 'Tag name cannot be empty'],
      maxlength: [32, 'Tag name cannot exceed 32 characters'],
    },
    color: {
      type: String,
      trim: true,
      default: '#7C3AED',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [150, 'Description cannot exceed 150 characters'],
      default: '',
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

TagSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>('Tag', TagSchema);
