"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  Gamepad2,
  ShieldAlert,
  Map,
  ScanLine,
  Trophy,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAuthStore, useNotificationStore, useLangStore } from "@/store";
import { translations } from "@/lib/data";
import { Avatar } from "@/components/ui/Badge";

const getNavItems = (t: any) => [
  { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
  { href: "/chatbot", label: t.aiAssistant, icon: MessageSquare },
  { href: "/candidates", label: t.candidates, icon: Users },
  { href: "/simulator", label: t.votingSim, icon: Gamepad2 },
  { href: "/fake-news", label: t.factCheck, icon: ShieldAlert },
  { href: "/planner", label: t.votePlanner, icon: Map },
  { href: "/scanner", label: t.docScanner, icon: ScanLine },
  { href: "/leaderboard", label: t.leaderboard, icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const { lang, toggleLang } = useLangStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const t = translations[lang];
  const navItems = getNavItems(t);

  const isLanding = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl",
          "border-b border-gray-100/50 dark:border-gray-800/50"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VoteWise AI+
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isLanding && user && (
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Language"
              >
                {lang === "en" ? "A/अ" : "अ/A"}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>

              {user && (
                <>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (unreadCount > 0) setUnreadCount(0);
                      }}
                      className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Bell className="w-4.5 h-4.5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold">Notifications</h3>
                          </div>
                          <div className="p-2 max-h-80 overflow-y-auto">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 mb-2">
                              <p className="text-sm font-medium">New Candidate added in your constituency.</p>
                              <span className="text-xs text-gray-500 mt-1">2 hours ago</span>
                            </div>
                            <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 mb-2">
                              <p className="text-sm font-medium">Election date announced for Phase 1!</p>
                              <span className="text-xs text-gray-500 mt-1">1 day ago</span>
                            </div>
                            <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 mb-2">
                              <p className="text-sm font-medium">You earned +100 XP from Simulator.</p>
                              <span className="text-xs text-gray-500 mt-1">2 days ago</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Link href="/profile" className="hidden sm:block">
                    <Avatar
                      src={user.photoURL}
                      name={user.fullName || user.email}
                      size="sm"
                    />
                  </Link>
                </>
              )}

              {isLanding && (
                <Link
                  href="/login"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </Link>
              )}

              {/* Mobile menu button */}
              {!isLanding && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 lg:hidden pt-16"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-16 bottom-0 w-72 bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800 p-4 overflow-y-auto"
            >
              {user && (
                <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <Avatar src={user.photoURL} name={user.fullName || user.email} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                    </Link>
                  );
                })}
              </div>

              {user && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
