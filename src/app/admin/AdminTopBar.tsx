"use client";
import { Bell, User } from "lucide-react";

export default function AdminTopBar() {
  return (
    <header className="h-16 bg-[#1A1A23] border-b border-[#2A2A35] flex items-center justify-between px-6 shrink-0">
      <h2 className="text-lg font-medium text-[#F5F5F5]">Admin Dashboard</h2>
      <div className="flex items-center gap-4 text-[#9CA3AF]">
        <button className="hover:text-[#D4A373] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#2A2A35] flex items-center justify-center text-[#F5F5F5]">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
