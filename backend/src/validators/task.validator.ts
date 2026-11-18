import { z } from 'zod';

export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);
export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const subtaskSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Subtask title cannot be empty').max(200),
  completed: z.boolean().default(false),
});

const objectIdOrNull = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((val) => (val && val.length > 0 ? val : null));

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  status: taskStatusEnum.default('TODO'),
  priority: taskPriorityEnum.default('MEDIUM'),
  category: z.string().trim().max(50).default('General'),
  tags: z.array(z.string().trim().min(1).max(32)).max(15).default([]),
  projectId: objectIdOrNull,
  subtasks: z.array(subtaskSchema).max(30).default([]),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid due date format',
    })
    .transform((val) => new Date(val)),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(120, 'Title cannot exceed 120 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    category: z.string().trim().max(50).optional(),
    tags: z.array(z.string().trim().min(1).max(32)).max(15).optional(),
    projectId: objectIdOrNull,
    subtasks: z.array(subtaskSchema).max(30).optional(),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date format',
      })
      .transform((val) => new Date(val))
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

export const updateTaskPrioritySchema = z.object({
  priority: taskPriorityEnum,
});

export const taskQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10)),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  projectId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z.enum(['dueDate', 'createdAt', 'title', 'priority']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type UpdateTaskPriorityInput = z.infer<typeof updateTaskPrioritySchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
