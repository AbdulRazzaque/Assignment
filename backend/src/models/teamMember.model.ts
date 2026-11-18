import mongoose, { Document, Schema, Model } from 'mongoose';

export type TeamMemberStatus = 'ACTIVE' | 'INVITED' | 'AWAY';

export interface ITeamMemberDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  department: string;
  status: TeamMemberStatus;
  avatarColor: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMemberDocument>(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'Developer',
      maxlength: [50, 'Role cannot exceed 50 characters'],
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering',
      maxlength: [50, 'Department cannot exceed 50 characters'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INVITED', 'AWAY'],
      default: 'INVITED',
    },
    avatarColor: {
      type: String,
      default: '#7C3AED',
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

TeamMemberSchema.index({ userId: 1, email: 1 }, { unique: true });

export const TeamMember: Model<ITeamMemberDocument> =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMemberDocument>('TeamMember', TeamMemberSchema);
