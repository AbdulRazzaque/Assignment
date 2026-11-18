import { z } from 'zod';

// --- Projects ---
export const projectStatusEnum = z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']);

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: 'Project name is required' })
    .trim()
    .min(1, 'Project name cannot be empty')
    .max(80, 'Project name cannot exceed 80 characters'),
  description: z.string().trim().max(500).optional().default(''),
  color: z.string().trim().default('#7C3AED'),
  status: projectStatusEnum.default('ACTIVE'),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && !isNaN(Date.parse(val)) ? new Date(val) : null)),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    description: z.string().trim().max(500).optional(),
    color: z.string().trim().optional(),
    status: projectStatusEnum.optional(),
    dueDate: z
      .string()
      .nullable()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        if (!val) return null;
        return !isNaN(Date.parse(val)) ? new Date(val) : null;
      }),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided to update',
  });

// --- Tags ---
export const createTagSchema = z.object({
  name: z
    .string({ required_error: 'Tag name is required' })
    .trim()
    .min(1, 'Tag name cannot be empty')
    .max(32, 'Tag name cannot exceed 32 characters'),
  color: z.string().trim().default('#7C3AED'),
  description: z.string().trim().max(150).optional().default(''),
});

export const updateTagSchema = z
  .object({
    name: z.string().trim().min(1).max(32).optional(),
    color: z.string().trim().optional(),
    description: z.string().trim().max(150).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided to update',
  });

// --- Team Members ---
export const teamMemberStatusEnum = z.enum(['ACTIVE', 'INVITED', 'AWAY']);

export const createTeamMemberSchema = z.object({
  name: z
    .string({ required_error: 'Member name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  role: z.string().trim().min(1).max(50).default('Developer'),
  department: z.string().trim().min(1).max(50).default('Engineering'),
  status: teamMemberStatusEnum.default('INVITED'),
  avatarColor: z.string().trim().default('#7C3AED'),
});

export const updateTeamMemberSchema = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    role: z.string().trim().min(1).max(50).optional(),
    department: z.string().trim().min(1).max(50).optional(),
    status: teamMemberStatusEnum.optional(),
    avatarColor: z.string().trim().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided to update',
  });

// --- Support Tickets ---
export const createSupportTicketSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(140),
  category: z.enum(['BUG', 'FEATURE', 'ACCOUNT', 'SECURITY', 'OTHER']).default('OTHER'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Please provide at least 10 characters of detail')
    .max(2000),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
