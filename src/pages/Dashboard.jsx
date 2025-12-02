import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { JournalCard } from '../components/JournalCard';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/Filters';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, [page, search, filters]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(filters.mood && { mood: filters.mood }),
        ...(filters.tag && { tag: filters.tag }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await api.get(`/api/journal?${params}`);
      setEntries(response.data.entries);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Fetch entries error:', error);
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/journal/${id}`);
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold">My Journal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-4 sticky top-20">
              <Button
                className="w-full"
                onClick={() => navigate('/entry/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
              <div className="space-y-4">
                <SearchBar onSearch={setSearch} />
                <Filters onFilterChange={setFilters} activeFilters={filters} />
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate('/entry/new');
                      setSidebarOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                  <SearchBar onSearch={setSearch} />
                  <Filters onFilterChange={setFilters} activeFilters={filters} />
                </div>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-4">
              <Tabs defaultValue="entries">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="entries">Entries</TabsTrigger>
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                </TabsList>
                <TabsContent value="entries" className="mt-4">
                  <Button
                    className="w-full mb-4"
                    onClick={() => navigate('/entry/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                  <SearchBar onSearch={setSearch} />
                </TabsContent>
                <TabsContent value="filters" className="mt-4">
                  <Filters onFilterChange={setFilters} activeFilters={filters} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Entries List */}
            {loading ? (
              <LoadingSkeleton />
            ) : entries.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <JournalCard
                      key={entry._id}
                      entry={entry}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

