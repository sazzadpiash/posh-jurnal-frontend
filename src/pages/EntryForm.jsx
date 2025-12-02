import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import TipTapEditor from '../editor/TipTapEditor';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const MOODS = ['Happy', 'Sad', 'Neutral', 'Stressed', 'Angry'];

export default function EntryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/journal/${id}`);
      const entry = response.data;
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setTags(entry.tags?.join(', ') || '');
    } catch (error) {
      console.error('Fetch entry error:', error);
      toast.error('Failed to load entry');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title,
        content,
        mood,
        tags
      };

      if (isEdit) {
        await api.put(`/api/journal/${id}`, payload);
        toast.success('Entry updated successfully');
      } else {
        await api.post('/api/journal', payload);
        toast.success('Entry created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(isEdit ? 'Failed to update entry' : 'Failed to create entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="text-sm font-medium mb-2 block">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Content</label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            className="min-h-[400px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mood" className="text-sm font-medium mb-2 block">
              Mood
            </label>
            <Select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="tags" className="text-sm font-medium mb-2 block">
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              type="text"
              placeholder="work, personal, travel..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

