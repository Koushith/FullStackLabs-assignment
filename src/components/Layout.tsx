import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, LayoutDashboard } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Quizzes', icon: Home },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="AI DevQuiz Home">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xs sm:text-sm">AI</span>
            </div>
            <span className="font-semibold text-base sm:text-lg tracking-tight">DevQuiz</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Nav */}
          <nav className="flex sm:hidden items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                  aria-label={item.label}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1" role="main">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8" role="contentinfo">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Learn AI development concepts through interactive quizzes
          </p>
        </div>
      </footer>
    </div>
  );
}
