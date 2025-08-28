import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const adminMenuItems = [
  { title: 'Admin Panel', url: '/admin', icon: Shield },
  { title: 'Tiketi', url: '/admin/tickets', icon: Ticket },
  { title: 'Korisnici', url: '/admin/users', icon: Users },
  { title: 'Statistike', url: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Uspješno ste se odjavili",
        description: "Preusmjeravanje na početnu stranicu..."
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Dogodila se greška pri odjavi",
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
      <SidebarTrigger 
        className="m-2 self-end" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      />
      
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-foreground">TeamUp</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "Administracija"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/admin'}
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && "Brze akcije"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="hover:bg-accent/50 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span>Natrag na app</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Odjavi se</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}