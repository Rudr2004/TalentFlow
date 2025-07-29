import { Link } from "wouter";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Brain, User, Settings, LogOut, Shield } from "lucide-react";

export function Navigation() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">RecruitAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#workflow" className="text-slate-300 hover:text-white transition-colors">
              How it Works
            </Link>
            <Link href="/#analytics" className="text-slate-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/#contact" className="text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Links */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback className="bg-purple-600">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-400 focus:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}