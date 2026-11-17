'use client';

import * as React from 'react';
import { TaskFilters } from '../../../components/tasks/task-filters';
import { TaskTable } from '../../../components/tasks/task-table';
import { TaskKanban } from '../../../components/tasks/task-kanban';
import { TaskCalendar } from '../../../components/tasks/task-calendar';
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

      {/* View Switch: Table / Kanban / Calendar */}
      {viewMode === 'table' && <TaskTable />}
      {viewMode === 'kanban' && <TaskKanban />}
      {viewMode === 'calendar' && <TaskCalendar />}
    </div>
  );
}
