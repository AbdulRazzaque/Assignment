import mongoose, { Document, Schema, Model } from 'mongoose';

export type SupportCategory = 'BUG' | 'FEATURE' | 'ACCOUNT' | 'SECURITY' | 'OTHER';
export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type SupportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface ISupportTicketDocument extends Document {
  _id: mongoose.Types.ObjectId;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  message: string;
  status: SupportStatus;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
      maxlength: [140, 'Subject cannot exceed 140 characters'],
    },
    category: {
      type: String,
      enum: ['BUG', 'FEATURE', 'ACCOUNT', 'SECURITY', 'OTHER'],
      default: 'OTHER',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_REVIEW', 'RESOLVED'],
      default: 'OPEN',
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

SupportTicketSchema.index({ userId: 1, createdAt: -1 });

export const SupportTicket: Model<ISupportTicketDocument> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicketDocument>('SupportTicket', SupportTicketSchema);
