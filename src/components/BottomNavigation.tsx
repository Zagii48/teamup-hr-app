import { Home, Trophy, Plus, User, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { path: '/', icon: Home, label: 'Pregled' },
  { path: '/sports', icon: Trophy, label: 'Sportovi' },
  { path: '/create', icon: Plus, label: 'Novi' },
  { path: '/profile', icon: User, label: 'Profil' },
  { path: '/settings', icon: Settings, label: 'Postavke' },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-mobile mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}