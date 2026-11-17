'use client';

import * as React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { useTaskStore } from '../../store/taskStore';
import { useToast } from '../ui/toast';
import { AlertTriangle } from 'lucide-react';

export function DeleteTaskDialog() {
  const { isDeleteModalOpen, setIsDeleteModalOpen, selectedTask, deleteTask } =
    useTaskStore();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!selectedTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(selectedTask._id);
      toast.success('Task removed permanently');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Delete Task"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">
          Are you sure you want to delete this task?
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          This will permanently delete &ldquo;
          <span className="font-semibold text-slate-800">
            {selectedTask?.title}
          </span>
          &rdquo;. This action cannot be reversed.
        </p>

        <div className="flex items-center justify-center gap-3 w-full mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="flex-1"
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
