"use client";

import { LogOut } from "lucide-react";
import { adminNavItems } from "@/components/adminNavItems";

export default function AdminSidebar({ activeView, onChangeView, onLogout }) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-dark/95 p-6 text-white shadow-soft backdrop-blur-sm lg:sticky lg:top-8 lg:self-start">
      <div className="flex items-center gap-2 px-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/45">Admin Panel</p>
      </div>
      <nav className="mt-10 grid gap-3">
        {adminNavItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id || (id === "products" && activeView === "edit-product");
          return (
            <button
              key={id}
              onClick={() => onChangeView(id)}
              className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-dark shadow-subtle"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"}`} />
              {label}
            </button>
          );
        })}
        
        <div className="my-4 border-t border-white/5" />
        
        <button
          onClick={onLogout}
          className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4 text-white/40 group-hover:text-accentBrown" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
