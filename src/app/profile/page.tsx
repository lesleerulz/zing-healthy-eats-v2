"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface UserData {
  id: number;
  username: string;
  email: string;
  address: string | null;
  profilePicture: string;
  isAdmin: boolean;
  isVerified: boolean;
  savedPhone: string | null;
}

// ─── Toast Component ────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className={`fixed top-6 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {message}
    </motion.div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar skeleton */}
            <div className="lg:w-72 p-8 bg-[#FDFCFA] border-b lg:border-b-0 lg:border-r border-[#EBE5D9]">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#EBE5D9] animate-pulse" />
                <div className="mt-4 w-32 h-6 rounded bg-[#EBE5D9] animate-pulse" />
                <div className="mt-2 w-40 h-4 rounded bg-[#EBE5D9] animate-pulse" />
                <div className="mt-6 w-full h-16 rounded-xl bg-[#EBE5D9] animate-pulse" />
              </div>
            </div>
            {/* Content skeleton */}
            <div className="flex-1 p-8">
              <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-28 h-9 rounded-lg bg-[#EBE5D9] animate-pulse"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <div className="w-full h-12 rounded-xl bg-[#EBE5D9] animate-pulse" />
                <div className="w-full h-12 rounded-xl bg-[#EBE5D9] animate-pulse" />
                <div className="w-36 h-11 rounded-xl bg-[#EBE5D9] animate-pulse mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Accordion Item (Mobile) ────────────────────────────────────────────────────

function AccordionItem({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#EBE5D9] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[#1C1816]">
          {icon}
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[#9A8A7A]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Profile Page ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  // Tab state (desktop)
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "delete"
  >("profile");

  // Accordion state (mobile)
  const [openAccordion, setOpenAccordion] = useState<string | null>("profile");

  // Profile form
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
    },
    []
  );

  // ─── Fetch user data ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        const data = await res.json();
        if (data.status && data.data) {
          setUser(data.data);
          setProfileForm({
            username: data.data.username,
            email: data.data.email,
          });
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    }

    async function fetchOrderCount() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setOrderCount(data.data.length);
        }
      } catch {
        // ignore — keep 0
      }
    }

    fetchUser();
    fetchOrderCount();
  }, [router]);

  // ─── Profile update handler ────────────────────────────────────────────────

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.status) {
        setUser(data.data);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // ─── Password change handler ──────────────────────────────────────────────

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (data.status) {
        showToast("Password changed successfully!", "success");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        showToast(data.message || "Failed to change password", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  // ─── Logout handler ───────────────────────────────────────────────────────

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth");
    } catch {
      router.push("/auth");
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────

  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  const userInitial = user.username?.charAt(0)?.toUpperCase() || "?";

  // ─── Tab content components ───────────────────────────────────────────────

  const ProfileInfoContent = (
    <form onSubmit={handleProfileSave} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A7A]" />
          <input
            type="text"
            value={profileForm.username}
            onChange={(e) =>
              setProfileForm({ ...profileForm, username: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl focus:outline-none focus:border-[#D4A373] text-[#1C1816] text-sm transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A7A]" />
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm({ ...profileForm, email: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl focus:outline-none focus:border-[#D4A373] text-[#1C1816] text-sm transition-colors"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={profileSaving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-xl text-sm font-semibold tracking-wide transition-colors hover:bg-[#3A322C] disabled:opacity-60"
      >
        {profileSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </motion.button>
    </form>
  );

  const ChangePasswordContent = (
    <form onSubmit={handlePasswordChange} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
          Current Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A7A]" />
          <input
            type={showPasswords ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl focus:outline-none focus:border-[#D4A373] text-[#1C1816] text-sm transition-colors"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            aria-label={showPasswords ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8A7A] hover:text-[#1C1816] transition-colors"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A7A]" />
          <input
            type={showPasswords ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl focus:outline-none focus:border-[#D4A373] text-[#1C1816] text-sm transition-colors"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            aria-label={showPasswords ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8A7A] hover:text-[#1C1816] transition-colors"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A7A]" />
          <input
            type={showPasswords ? "text" : "password"}
            value={passwordForm.confirmNewPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmNewPassword: e.target.value,
              })
            }
            className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl focus:outline-none focus:border-[#D4A373] text-[#1C1816] text-sm transition-colors"
            placeholder="Re-enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            aria-label={showPasswords ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8A7A] hover:text-[#1C1816] transition-colors"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={passwordSaving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-xl text-sm font-semibold tracking-wide transition-colors hover:bg-[#3A322C] disabled:opacity-60"
      >
        {passwordSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Change Password"
        )}
      </motion.button>
    </form>
  );

  const DeleteAccountContent = (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-800">Danger Zone</p>
          <p className="text-sm text-red-600 mt-1">
            Deleting your account is permanent. All your data, order history,
            and saved preferences will be permanently removed. This action
            cannot be undone.
          </p>
        </div>
      </div>

      {!showDeleteConfirm ? (
        <motion.button
          onClick={() => setShowDeleteConfirm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
          I understand, delete my account
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-300 rounded-xl"
        >
          <p className="text-sm font-semibold text-red-800 mb-3">
            Are you absolutely sure?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-[#1C1816] bg-white border border-[#DCD4C4] rounded-lg hover:bg-[#FAF8F5] transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors opacity-50 cursor-not-allowed">
              Delete (coming soon)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  // ─── Tab definitions ──────────────────────────────────────────────────────

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile Information",
      icon: <User className="w-4 h-4" />,
      content: ProfileInfoContent,
    },
    {
      id: "password" as const,
      label: "Change Password",
      icon: <Lock className="w-4 h-4" />,
      content: ChangePasswordContent,
    },
    {
      id: "delete" as const,
      label: "Delete Account",
      icon: <Trash2 className="w-4 h-4" />,
      content: DeleteAccountContent,
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 px-4 md:px-8 selection:bg-[#D4A373] selection:text-white">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#1C1816]">
            My Account
          </h1>
          <p className="text-sm text-[#9A8A7A] mt-1">
            Manage your profile, security, and preferences.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* ─── Left Sidebar ──────────────────────────────────────────── */}
            <div className="lg:w-72 shrink-0 p-8 bg-[#FDFCFA] border-b lg:border-b-0 lg:border-r border-[#EBE5D9]">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-[#D4A373] flex items-center justify-center shadow-md">
                  <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">
                    {userInitial}
                  </span>
                </div>

                {/* Username */}
                <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1C1816]">
                  {user.username}
                </h2>

                {/* Email */}
                <p className="mt-1 text-sm italic text-[#D4A373]">
                  {user.email}
                </p>

                {/* Verification Badge */}
                <div className="mt-3">
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Not Verified
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="mt-6 w-full">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9A8A7A] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Address
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl px-4 py-3 text-sm text-[#1C1816]">
                    {user.address || (
                      <span className="italic text-[#BDB0A0]">
                        No address saved yet.
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout button */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#7A614A] bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl hover:bg-[#EBE5D9] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </div>
            </div>

            {/* ─── Right Content ─────────────────────────────────────────── */}
            <div className="flex-1 p-6 md:p-8">
              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <div className="flex gap-1 mb-8 border-b border-[#EBE5D9]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-[#1C1816]"
                          : "text-[#9A8A7A] hover:text-[#7A614A]"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A373]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tabs.find((t) => t.id === activeTab)?.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Accordion */}
              <div className="lg:hidden">
                {tabs.map((tab) => (
                  <AccordionItem
                    key={tab.id}
                    title={tab.label}
                    icon={tab.icon}
                    isOpen={openAccordion === tab.id}
                    onToggle={() =>
                      setOpenAccordion(
                        openAccordion === tab.id ? null : tab.id
                      )
                    }
                  >
                    {tab.content}
                  </AccordionItem>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Account Summary Section ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Email Verified */}
          <div className="bg-white rounded-xl border border-[#EBE5D9] p-5 flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                user.isVerified
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9A8A7A]">
                Email Verified
              </p>
              <p
                className={`text-sm font-bold ${
                  user.isVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {user.isVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Orders Placed */}
          <div className="bg-white rounded-xl border border-[#EBE5D9] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FDF3E7] text-[#D4A373] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9A8A7A]">
                Orders Placed
              </p>
              <p className="text-sm font-bold text-[#1C1816]">{orderCount}</p>
            </div>
          </div>

          {/* View Order History */}
          <a
            href="/orders"
            className="bg-white rounded-xl border border-[#EBE5D9] p-5 flex items-center justify-between hover:border-[#D4A373] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#9A8A7A] flex items-center justify-center group-hover:text-[#D4A373] transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9A8A7A]">
                  Order History
                </p>
                <p className="text-sm font-bold text-[#1C1816]">
                  View all orders
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9A8A7A] group-hover:text-[#D4A373] transition-colors" />
          </a>
          
          {/* Admin Dashboard Access */}
          {user.isAdmin && (
            <a
              href="/admin"
              className="bg-[#1C1816] rounded-xl border border-[#1C1816] p-5 flex items-center justify-between hover:bg-[#3A322C] transition-colors group md:col-span-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#3A322C] text-[#D4A373] flex items-center justify-center group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                    Admin Area
                  </p>
                  <p className="text-sm font-bold text-white">
                    Access Admin Dashboard
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D4A373] group-hover:text-white transition-colors" />
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
