import { BookOpen, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start your journaling journey by creating your first entry. Capture your thoughts, feelings, and memories.
      </p>
      <Button onClick={() => navigate('/entry/new')}>
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Entry
      </Button>
    </div>
  );
};

