'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Tags as TagsIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpRight,
  X,
  Hash,
  Sparkles,
} from 'lucide-react';
import { TagItem } from '../../../types';
import { tagService } from '../../../services/workspace.service';
import { useTaskStore } from '../../../store/taskStore';
import { useToast } from '../../../components/ui/toast';
import { Skeleton } from '../../../components/ui/skeleton';

const TAG_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#D97706',
  '#DC2626',
  '#DB2777',
  '#0891B2',
  '#475569',
];

export default function TagsPage() {
  const router = useRouter();
  const toast = useToast();
  const { setFilters, setViewMode, openCreateModal, fetchTags: syncStoreTags } = useTaskStore();

  const [tags, setTags] = React.useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<TagItem | null>(null);

  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#7C3AED');
  const [description, setDescription] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const loadTags = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadTags();
  }, [loadTags]);

  const openNewTagModal = () => {
    setEditingTag(null);
    setName('');
    setColor('#7C3AED');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditTagModal = (tag: TagItem) => {
    setEditingTag(tag);
    setName(tag.name);
    setColor(tag.color || '#7C3AED');
    setDescription(tag.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag._id, {
          name: name.trim(),
          color,
          description: description.trim(),
        });
        toast.success('Tag updated and synced across tasks');
      } else {
        await tagService.createTag({
          name: name.trim(),
          color,
          description: description.trim(),
        });
        toast.success('Tag created');
      }
      setIsModalOpen(false);
      await Promise.all([loadTags(), syncStoreTags()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tag');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tag: TagItem) => {
    if (!confirm(`Delete tag "#${tag.name}"? It will be removed from all tagged tasks.`)) {
      return;
    }

    try {
      await tagService.deleteTag(tag._id);
      toast.success('Tag deleted');
      await Promise.all([loadTags(), syncStoreTags()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  };

  const handleViewTasksByTag = (tagName: string) => {
    setViewMode('table');
    setFilters({
      tag: tagName,
      category: undefined,
      projectId: undefined,
      page: 1,
    });
    router.push('/tasks');
  };

  const handleQuickSeedDefaults = async () => {
    const presets = [
      { name: 'urgent', color: '#DC2626', description: 'Needs immediate attention' },
      { name: 'frontend', color: '#2563EB', description: 'UI/UX and client work' },
      { name: 'api', color: '#7C3AED', description: 'Backend REST endpoints' },
      { name: 'bugfix', color: '#D97706', description: 'Defect resolution' },
      { name: 'release', color: '#059669', description: 'Production deployment items' },
    ];
    let created = 0;
    for (const p of presets) {
      try {
        await tagService.createTag(p);
        created++;
      } catch {
        // skip if exists
      }
    }
    if (created > 0) {
      toast.success(`Added ${created} starter tags`);
      await Promise.all([loadTags(), syncStoreTags()]);
    } else {
      toast.info('Starter tags already exist');
    }
  };

  const filteredTags = tags.filter(
    (t) =>
      !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalTaggedUsages = tags.reduce((acc, t) => acc + t.usageCount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tags Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Create color-coded labels to cross-categorize and filter tasks effortlessly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {tags.length === 0 && (
            <button
              type="button"
              onClick={handleQuickSeedDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 px-3.5 py-2.5 text-xs font-bold text-[#7C3AED] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Add Starter Tags</span>
            </button>
          )}
          <button
            type="button"
            onClick={openNewTagModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Tag</span>
          </button>
        </div>
      </div>

      {/* Summary & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags by name or description..."
            className="h-9 w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <span>
            <strong className="text-slate-900">{tags.length}</strong> Total Tags
          </span>
          <span className="h-3.5 w-px bg-slate-200" />
          <span>
            <strong className="text-[#7C3AED]">{totalTaggedUsages}</strong> Task Assignments
          </span>
        </div>
      </div>

      {/* Tags Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-4">
            <TagsIcon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {tags.length === 0 ? 'No tags created yet' : 'No matching tags found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Tags help you spot blockers, sprints, platforms, or bugfixes across any project or
            category.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleQuickSeedDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
              <span>Generate Starter Tags</span>
            </button>
            <button
              type="button"
              onClick={openNewTagModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create Tag</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map((tag) => (
            <div
              key={tag._id}
              className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                    style={{ backgroundColor: tag.color }}
                  >
                    <Hash className="h-3 w-3 opacity-80" />
                    {tag.name}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditTagModal(tag)}
                      title="Edit tag"
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tag)}
                      title="Delete tag"
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                  {tag.description || 'Reusable workspace label for filtering tasks.'}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">
                  Used on{' '}
                  <strong className="text-slate-900">
                    {tag.usageCount} task{tag.usageCount === 1 ? '' : 's'}
                  </strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openCreateModal({ tags: [tag.name] })}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED]"
                  >
                    + Task
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewTasksByTag(tag.name)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:underline"
                  >
                    Filter <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Live Pill Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <Hash className="h-3.5 w-3.5 opacity-80" />
                  {name.trim() || 'tag-preview'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tag Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., urgent, api, v2-launch"
                  maxLength={32}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="When should teammates apply this tag?"
                  maxLength={150}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Label Color</label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {TAG_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setColor(hex)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        color === hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-bold text-white shadow-md shadow-purple-500/25 disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
