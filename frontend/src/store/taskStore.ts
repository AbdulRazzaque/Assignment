import { create } from 'zustand';
import {
  Task,
  PaginationMeta,
  TaskQueryParams,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
  TaskPriority,
  Project,
  TagItem,
} from '../types';
import { taskService } from '../services/task.service';
import { projectService, tagService } from '../services/workspace.service';

export interface DraftTaskDefaults {
  category?: string;
  projectId?: string | null;
  tags?: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
}

interface TaskState {
  tasks: Task[];
  projects: Project[];
  tags: TagItem[];
  pagination: PaginationMeta | null;
  filters: TaskQueryParams;
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;
  draftDefaults: DraftTaskDefaults | null;
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
  viewMode: 'table' | 'kanban' | 'calendar';

  setFilters: (filters: Partial<TaskQueryParams>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'table' | 'kanban' | 'calendar') => void;
  setSelectedTask: (task: Task | null) => void;
  setDraftDefaults: (defaults: DraftTaskDefaults | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  openCreateModal: (defaults?: DraftTaskDefaults) => void;

  fetchTasks: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTags: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateStatus: (id: string, status: TaskStatus) => Promise<void>;
  updatePriority: (id: string, priority: TaskPriority) => Promise<void>;
}

const initialFilters: TaskQueryParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [],
  tags: [],
  pagination: null,
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedTask: null,
  draftDefaults: null,
  isModalOpen: false,
  isDeleteModalOpen: false,
  viewMode: 'table',

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchTasks();
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchTasks();
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedTask: (selectedTask) => set({ selectedTask }),
  setDraftDefaults: (draftDefaults) => set({ draftDefaults }),
  setIsModalOpen: (isModalOpen) => {
    if (!isModalOpen) {
      set({ isModalOpen: false, draftDefaults: null });
    } else {
      set({ isModalOpen: true });
    }
  },
  setIsDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),

  openCreateModal: (defaults) => {
    set({
      selectedTask: null,
      draftDefaults: defaults || null,
      isModalOpen: true,
    });
  },

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { tasks, pagination } = await taskService.getTasks(get().filters);
      set({
        tasks,
        pagination: pagination || null,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  fetchProjects: async () => {
    try {
      const projects = await projectService.getProjects();
      set({ projects });
    } catch {
      // silent fallback
    }
  },

  fetchTags: async () => {
    try {
      const tags = await tagService.getTags();
      set({ tags });
    } catch {
      // silent fallback
    }
  },

  createTask: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.createTask(data);
      set({ isModalOpen: false, draftDefaults: null, isLoading: false });
      await Promise.all([get().fetchTasks(), get().fetchProjects(), get().fetchTags()]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.updateTask(id, data);
      set({ isModalOpen: false, selectedTask: null, draftDefaults: null, isLoading: false });
      await Promise.all([get().fetchTasks(), get().fetchProjects(), get().fetchTags()]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.deleteTask(id);
      set({ isDeleteModalOpen: false, selectedTask: null, isLoading: false });
      await Promise.all([get().fetchTasks(), get().fetchProjects(), get().fetchTags()]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));

    try {
      await taskService.updateStatus(id, status);
      await Promise.all([get().fetchTasks(), get().fetchProjects()]);
    } catch (err: unknown) {
      set({ tasks: previousTasks });
      const message = err instanceof Error ? err.message : 'Failed to update status';
      set({ error: message });
      throw err;
    }
  },

  updatePriority: async (id, priority) => {
    try {
      await taskService.updatePriority(id, priority);
      await get().fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update priority';
      set({ error: message });
      throw err;
    }
  },
}));
