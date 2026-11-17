import { create } from 'zustand';
import { Task, PaginationMeta, TaskQueryParams, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '../types';
import { taskService } from '../services/task.service';

interface TaskState {
  tasks: Task[];
  pagination: PaginationMeta | null;
  filters: TaskQueryParams;
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
  viewMode: 'table' | 'kanban';

  setFilters: (filters: Partial<TaskQueryParams>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'table' | 'kanban') => void;
  setSelectedTask: (task: Task | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;

  fetchTasks: () => Promise<void>;
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
  pagination: null,
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedTask: null,
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
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  setIsDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),

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

  createTask: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.createTask(data);
      set({ isModalOpen: false, isLoading: false });
      await get().fetchTasks();
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
      set({ isModalOpen: false, selectedTask: null, isLoading: false });
      await get().fetchTasks();
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
      await get().fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    // Optimistic UI update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));

    try {
      await taskService.updateStatus(id, status);
      await get().fetchTasks();
    } catch (err: unknown) {
      // Revert optimistic update
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
