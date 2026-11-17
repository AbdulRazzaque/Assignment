'use client';

import * as React from 'react';
import { TaskFilters } from '../../../components/tasks/task-filters';
import { TaskTable } from '../../../components/tasks/task-table';
import { TaskKanban } from '../../../components/tasks/task-kanban';
import { useTaskStore } from '../../../store/taskStore';

export default function TasksPage() {
  const { viewMode, fetchTasks } = useTaskStore();

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-6 pb-12">
      {/* Filters & Actions matching Image 4 */}
      <TaskFilters />

      {/* Table / Kanban View matching Image 4 */}
      {viewMode === 'table' ? <TaskTable /> : <TaskKanban />}
    </div>
  );
}
