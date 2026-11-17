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
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { Task } from '../../types';

export function TaskCalendar() {
  const { tasks, setSelectedTask, setIsModalOpen } = useTaskStore();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [calendarView, setCalendarView] = React.useState<'month' | 'week' | 'day'>('month');

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
    setSelectedTask({
      _id: '',
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'Design',
      dueDate: format(day, 'yyyy-MM-dd'),
      userId: '',
      isOverdue: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header matching Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            View and manage tasks by due date.
          </p>
        </div>

        {/* Controls matching Screen 7: Today, < >, Month year, Month/Week/Day, + New Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
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

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-2xs">
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Month / Week / Day Pills */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'month'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'week'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'day'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Day
            </button>
          </div>

          <button
            onClick={() => handleDayClick(new Date())}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container matching Screen 7 */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 text-center text-xs font-bold text-slate-500 py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
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
                {/* Day Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isDayToday
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-300'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Task Events matching Screen 7 */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((task) => {
                    // Badge color matching Screen 7 (e.g. purple, rose, green, blue, amber)
                    const catLower = (task.category || 'design').toLowerCase();
                    const pillBg =
                      catLower.includes('design')
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : catLower.includes('backend')
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : catLower.includes('devops')
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : catLower.includes('frontend')
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200';

                    return (
                      <div
                        key={task._id}
                        onClick={(e) => handleTaskClick(task, e)}
                        title={`${task.title} (${task.status})`}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all truncate hover:scale-102 ${pillBg}`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
