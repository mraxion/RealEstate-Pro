import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Building, 
  Users, 
  Calendar, 
  Zap, 
  ClipboardList, 
  Settings, 
  Sliders, 
  Menu, 
  Bell
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { 
      section: "Principal", 
      items: [
        { 
          name: "Dashboard", 
          href: "/", 
          icon: <Home className="w-5 h-5 mr-2" /> 
        },
        { 
          name: "Propiedades", 
          href: "/properties", 
          icon: <Building className="w-5 h-5 mr-2" /> 
        },
        { 
          name: "Leads", 
          href: "/leads", 
          icon: <Users className="w-5 h-5 mr-2" /> 
        },
        { 
          name: "Citas", 
          href: "/appointments", 
          icon: <Calendar className="w-5 h-5 mr-2" /> 
        },
      ]
    },
    {
      section: "Automatización",
      items: [
        {
          name: "Flujos de Trabajo",
          href: "/workflows",
          icon: <Zap className="w-5 h-5 mr-2" />
        },
        {
          name: "Plantillas",
          href: "/templates",
          icon: <ClipboardList className="w-5 h-5 mr-2" />
        }
      ]
    },
    {
      section: "Configuración",
      items: [
        {
          name: "Configuración",
          href: "/settings",
          icon: <Settings className="w-5 h-5 mr-2" />
        },
        {
          name: "Integraciones",
          href: "/integrations",
          icon: <Sliders className="w-5 h-5 mr-2" />
        }
      ]
    }
  ];

  const NavLinks = () => (
    <nav className="flex-1 overflow-y-auto py-4">
      {navItems.map((section, i) => (
        <div key={i} className="mb-6">
          <div className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {section.section}
          </div>
          {section.items.map((item, j) => (
            <Link key={j} href={item.href}>
              <a 
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-medium",
                  location === item.href 
                    ? "text-primary-700 bg-primary-50" 
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 text-primary-600">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
              </svg>
            </div>
            <h1 className="ml-2 text-xl font-semibold text-neutral-900">InmoAdmin</h1>
          </div>
        </div>
        
        <NavLinks />
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <img 
              className="h-8 w-8 rounded-full" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Foto de perfil" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-800">Ana García</p>
              <p className="text-xs font-medium text-neutral-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-0 left-0 z-40 w-full bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" className="text-neutral-500 hover:text-neutral-600">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
              <div className="px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 text-primary-600">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                    </svg>
                  </div>
                  <h1 className="ml-2 text-xl font-semibold text-neutral-900">InmoAdmin</h1>
                </div>
              </div>
              <NavLinks />
              <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Foto de perfil" 
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-800">Ana García</p>
                    <p className="text-xs font-medium text-neutral-500">Administrador</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center">
            <div className="w-7 h-7 text-primary-600">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
              </svg>
            </div>
            <h1 className="ml-2 text-xl font-semibold text-neutral-900">InmoAdmin</h1>
          </div>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        {/* Header */}
        <header className="hidden md:block bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            <div className="flex items-center space-x-4">
              <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-900">
                <Bell className="h-6 w-6" />
              </button>
              <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
