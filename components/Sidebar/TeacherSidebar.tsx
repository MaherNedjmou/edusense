"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, NotepadTextDashed, Package, Users, User, LogOut, Menu, X } from "lucide-react";

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/teacher", label: "Home", icon: Home },
    { href: "/teacher/analysis", label: "Analyze Papers", icon: NotepadTextDashed },
    { href: "/teacher/classes", label: "My Classes", icon: Package },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/profile", label: "My Profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background shadow-md px-4 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 text-primary hover:bg-secondary/20 rounded transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-semibold text-primary">Teacher Dashboard</span>
        {/* optional space to balance flex */}
        <div className="w-6" />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-background
          h-screen shadow-2xl flex flex-col p-6
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-bold text-primary">Teacher Dashboard</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition group relative font-semibold
                  ${
                    isActive
                      ? "text-secondary bg-white shadow-md hover:shadow-lg"
                      : "text-primary hover:text-secondary hover:bg-white/50 hover:shadow-md"
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout Button */}
        <Link
          href="/login"
          onClick={closeSidebar}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-red-400 to-red-500/90 text-white font-semibold rounded-lg hover:from-red-500/90 hover:to-red-500 transition shadow-md hover:shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </aside>
    </>
  );
};

export default DashboardSidebar;