import mongoose from 'mongoose';
import { Tag } from '../models/tag.model';
import { Task } from '../models/task.model';
import { CreateTagInput, UpdateTagInput } from '../validators/workspace.validator';
import { AppError } from '../utils/appError';

export interface TagWithUsageDto {
  _id: string;
  name: string;
  color: string;
  description: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TagService {
  static async getTags(userId: string): Promise<TagWithUsageDto[]> {
    const ownerId = new mongoose.Types.ObjectId(userId);

    const [tags, usageAgg] = await Promise.all([
      Tag.find({ userId: ownerId }).sort({ name: 1 }),
      Task.aggregate([
        { $match: { userId: ownerId, tags: { $exists: true, $ne: [] } } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
      ]),
    ]);

    const usageMap = new Map<string, number>();
    for (const row of usageAgg) {
      usageMap.set(row._id, row.count);
    }

    return tags.map((t) => ({
      _id: t._id.toString(),
      name: t.name,
      color: t.color || '#7C3AED',
      description: t.description || '',
      usageCount: usageMap.get(t.name) || 0,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  static async createTag(userId: string, input: CreateTagInput): Promise<TagWithUsageDto> {
    const existing = await Tag.findOne({
      userId,
      name: { $regex: `^${input.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });

    if (existing) {
      throw new AppError(409, `Tag "${input.name}" already exists`);
    }

    const tag = await Tag.create({
      ...input,
      userId,
    });

    const usageCount = await Task.countDocuments({ userId, tags: tag.name });

    return {
      _id: tag._id.toString(),
      name: tag.name,
      color: tag.color,
      description: tag.description || '',
      usageCount,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  static async updateTag(
    userId: string,
    tagId: string,
    input: UpdateTagInput
  ): Promise<TagWithUsageDto> {
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      throw new AppError(400, 'Invalid tag ID');
    }

    const existing = await Tag.findOne({ _id: tagId, userId });
    if (!existing) {
      throw new AppError(404, 'Tag not found');
    }

    const oldName = existing.name;
    if (input.name && input.name !== oldName) {
      const duplicate = await Tag.findOne({
        userId,
        _id: { $ne: tagId },
        name: { $regex: `^${input.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      });
      if (duplicate) {
        throw new AppError(409, `Tag "${input.name}" already exists`);
      }
    }

    const updated = await Tag.findOneAndUpdate(
      { _id: tagId, userId },
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError(404, 'Tag not found');
    }

    // Cascade rename across user tasks if name changed
    if (input.name && input.name !== oldName) {
      await Task.updateMany(
        { userId, tags: oldName },
        { $set: { 'tags.$[elem]': input.name } },
        { arrayFilters: [{ elem: oldName }] }
      );
    }

    const usageCount = await Task.countDocuments({ userId, tags: updated.name });

    return {
      _id: updated._id.toString(),
      name: updated.name,
      color: updated.color,
      description: updated.description || '',
      usageCount,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async deleteTag(userId: string, tagId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      throw new AppError(400, 'Invalid tag ID');
    }

    const deleted = await Tag.findOneAndDelete({ _id: tagId, userId });
    if (!deleted) {
      throw new AppError(404, 'Tag not found');
    }

    // Remove deleted tag from tasks
    await Task.updateMany({ userId, tags: deleted.name }, { $pull: { tags: deleted.name } });
  }
}
