import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import AdminAnimatePresence from "./AdminAnimatePresence";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    redirect("/profile");
  }

  const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  if (!jwtSecret) {
    redirect("/profile");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { isAdmin?: boolean; userId?: number };
    if (!decoded.isAdmin) {
      redirect("/profile");
    }
  } catch (error) {
    console.error("[AdminLayout] JWT verification failed:", error);
    redirect("/profile");
  }

  return (
    <div className="flex h-screen bg-[#0F0F12] text-[#F5F5F5]">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <AdminAnimatePresence>
            {children}
          </AdminAnimatePresence>
        </main>
      </div>
    </div>
  );
}
