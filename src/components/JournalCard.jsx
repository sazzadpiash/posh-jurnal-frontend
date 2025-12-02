import { format } from 'date-fns';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const MOOD_COLORS = {
  Happy: 'bg-green-500/20 text-green-700 dark:text-green-400',
  Sad: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Neutral: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  Stressed: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  Angry: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

export const JournalCard = ({ entry, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/entry/${entry._id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry._id);
    }
  };

  // Strip HTML tags for preview
  const getPreview = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    const text = div.textContent || div.innerText || '';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(entry.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <Badge className={MOOD_COLORS[entry.mood] || MOOD_COLORS.Neutral}>
            {entry.mood}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {getPreview(entry.content)}
        </p>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

