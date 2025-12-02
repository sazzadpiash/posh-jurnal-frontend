import { Card, CardContent, CardHeader } from './ui/card';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const EntryFormSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded w-full"></div>
      <div className="h-64 bg-muted rounded w-full"></div>
      <div className="h-10 bg-muted rounded w-1/3"></div>
      <div className="h-10 bg-muted rounded w-1/2"></div>
    </div>
  );
};

