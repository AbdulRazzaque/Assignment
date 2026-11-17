'use client';

import * as React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { Task } from '../../types';

export function TaskCalendar() {
  const { tasks, setSelectedTask, setIsModalOpen } = useTaskStore();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDayClick = (day: Date) => {
    // Open create modal with pre-selected due date
    setSelectedTask({
      _id: '',
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'General',
      dueDate: format(day, 'yyyy-MM-dd'),
      userId: '',
      isOverdue: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Calendar Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Scheduled tasks and upcoming deadlines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={prevMonth}
              title="Previous Month"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              title="Next Month"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60 text-center text-xs font-bold text-slate-500 py-3">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[580px]">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          // Find tasks due on this day
          const dayTasks = tasks.filter((t) => {
            try {
              const d = new Date(t.dueDate);
              return isSameDay(d, day);
            } catch {
              return false;
            }
          });

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`group relative p-2.5 flex flex-col justify-between transition-colors cursor-pointer min-h-[110px] ${
                !isCurrentMonth
                  ? 'bg-slate-50/30 text-slate-300'
                  : 'bg-white hover:bg-slate-50/70 text-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isDayToday
                      ? 'bg-brand-600 text-white shadow-xs'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {isCurrentMonth && (
                  <button
                    title="Add task on this date"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Tasks List in Day Cell */}
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px]">
                {dayTasks.slice(0, 3).map((task) => {
                  const isCompleted = task.status === 'COMPLETED';

                  const priorityDot =
                    task.priority === 'HIGH'
                      ? 'bg-rose-500'
                      : task.priority === 'MEDIUM'
                      ? 'bg-purple-500'
                      : 'bg-blue-400';

                  return (
                    <div
                      key={task._id}
                      onClick={(e) => handleTaskClick(task, e)}
                      title={`${task.title} (${task.status})`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all truncate ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 line-through opacity-75'
                          : 'bg-white hover:bg-brand-50 text-slate-800 border-slate-200/80 shadow-2xs hover:border-brand-300'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot}`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <p className="text-[10px] font-bold text-slate-400 pl-1">
                    +{dayTasks.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
