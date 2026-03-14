"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  GraduationCap
} from "lucide-react";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "My Classes", href: "/student/classes", icon: GraduationCap },
  { name: "Global Tasks", href: "/student/tasks", icon: BookOpen },
  { name: "Settings", href: "/student/settings", icon: Settings },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-primary/10 rounded-xl shadow-sm text-primary"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-primary/5 flex flex-col transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <Link href="/student" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-secondary/30">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">EduSense</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em] mb-4">Student Portal</p>
          
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
                  ${isActive 
                    ? "bg-secondary/10 text-secondary shadow-sm shadow-secondary/5" 
                    : "text-primary/50 hover:bg-primary/5 hover:text-primary"}
                `}
              >
                <Icon size={18} className={isActive ? "text-secondary" : "text-primary/40 group-hover:text-primary"} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight size={14} className="text-secondary opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/5 mt-auto">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500/70 hover:bg-red-50 hover:text-red-500 transition-all group">
            <LogOut size={18} className="text-red-500/40 group-hover:text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
