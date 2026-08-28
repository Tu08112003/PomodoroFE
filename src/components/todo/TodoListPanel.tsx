import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, X, RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { TodoItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TodoListPanelProps {
  cloudStatus?: 'loading' | 'anonymous' | 'authenticated';
  tasks: TodoItem[];
  lastResetDate: string;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
  onClose: () => void;
}

export const TodoListPanel: React.FC<TodoListPanelProps> = ({
  tasks,
  lastResetDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
  onClose,
  cloudStatus,
}) => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTask(inputText);
    setInputText('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-80 sm:w-[440px] p-5 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/15 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm tracking-wide text-white">{t.todoTitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Reset Notification Badge */}
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>{t.autoResetNotice}</span>
        </div>
        <span className="flex items-center justify-center font-mono text-[10px] text-emerald-400/80">
          {cloudStatus === 'authenticated' ? 'Cloud · ' : ''}{t.dateLabel} {lastResetDate}
        </span>
      </div>

      {/* Completion Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>{t.progressLabel}</span>
          <span className="font-mono font-semibold text-emerald-400">
            {completedCount}/{totalCount} ({progress}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add New Task Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.addPlaceholder}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Task Items List */}
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <CheckSquare className="w-8 h-8 opacity-30 text-emerald-400" />
            <span>{t.noTasks}</span>
          </div>
        ) : (
          tasks.map((taskItem) => (
            <div
              key={taskItem.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                taskItem.completed
                  ? 'bg-slate-950/20 border-white/5 opacity-60'
                  : 'bg-slate-950/40 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => onToggleTask(taskItem.id)}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
              >
                {taskItem.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 hover:text-emerald-400" />
                )}
                <span
                  className={`text-xs truncate ${
                    taskItem.completed ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {taskItem.text}
                </span>
              </button>
              <button
                onClick={() => onDeleteTask(taskItem.id)}
                className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Clear Completed Tasks Button */}
      {completedCount > 0 && (
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClearCompleted}
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            {t.clearCompleted}
          </button>
        </div>
      )}
    </div>
  );
};
