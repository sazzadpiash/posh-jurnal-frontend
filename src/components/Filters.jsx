import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const MOODS = ['Happy', 'Sad', 'Neutral', 'Stressed', 'Angry'];

export const Filters = ({ onFilterChange, activeFilters }) => {
  const [mood, setMood] = useState(activeFilters.mood || '');
  const [tag, setTag] = useState(activeFilters.tag || '');
  const [startDate, setStartDate] = useState(activeFilters.startDate || '');
  const [endDate, setEndDate] = useState(activeFilters.endDate || '');

  const handleMoodChange = (e) => {
    const value = e.target.value;
    setMood(value);
    onFilterChange({ ...activeFilters, mood: value || undefined });
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTag(value);
    onFilterChange({ ...activeFilters, tag: value || undefined });
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    onFilterChange({ ...activeFilters, startDate: value || undefined });
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    onFilterChange({ ...activeFilters, endDate: value || undefined });
  };

  const clearFilters = () => {
    setMood('');
    setTag('');
    setStartDate('');
    setEndDate('');
    onFilterChange({});
  };

  const hasActiveFilters = mood || tag || startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Mood</label>
          <Select value={mood} onChange={handleMoodChange}>
            <option value="">All moods</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Tag</label>
          <Input
            type="text"
            placeholder="Filter by tag"
            value={tag}
            onChange={handleTagChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {mood && <Badge variant="secondary">{mood}</Badge>}
          {tag && <Badge variant="secondary">Tag: {tag}</Badge>}
          {startDate && <Badge variant="secondary">From: {startDate}</Badge>}
          {endDate && <Badge variant="secondary">To: {endDate}</Badge>}
        </div>
      )}
    </div>
  );
};

