"use client";
import { Bell, User, LogOut, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Handle sub-routes like /admin/orders/123
  const segment = Object.keys(PAGE_TITLES)
    .filter((key) => key !== "/admin")
    .find((key) => pathname.startsWith(key));
  return segment ? PAGE_TITLES[segment] : "Admin";
}

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showBell, setShowBell] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/profile");
    router.refresh();
  };

  return (
    <header className="h-16 bg-[#1A1A23] border-b border-[#2A2A35] flex items-center justify-between px-6 shrink-0">
      <h2 className="text-lg font-semibold text-[#F5F5F5]">{pageTitle}</h2>

      <div className="flex items-center gap-3 text-[#9CA3AF]">
        {/* Bell / Notifications */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setShowBell((p) => !p); setShowUser(false); }}
            className="relative p-2 rounded-lg hover:bg-[#2A2A35] hover:text-[#D4A373] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showBell && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1A1A23] border border-[#2A2A35] rounded-xl shadow-2xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A35]">
                <span className="text-sm font-medium text-[#F5F5F5]">Notifications</span>
                <button onClick={() => setShowBell(false)} className="text-[#9CA3AF] hover:text-[#F5F5F5]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 py-8 text-center text-sm text-[#9CA3AF]">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User / Logout */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setShowUser((p) => !p); setShowBell(false); }}
            className="w-9 h-9 rounded-full bg-[#2A2A35] flex items-center justify-center hover:ring-2 hover:ring-[#D4A373] transition-all"
            aria-label="User menu"
          >
            <User className="w-5 h-5 text-[#F5F5F5]" />
          </button>

          {showUser && (
            <div className="absolute right-0 mt-2 w-44 bg-[#1A1A23] border border-[#2A2A35] rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
