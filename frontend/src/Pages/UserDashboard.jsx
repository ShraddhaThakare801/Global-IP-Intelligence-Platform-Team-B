import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Search,
  User,
  Bookmark,
  History,
  BarChart3,
  FileText,
  ShieldCheck,
  Plus,
  Eye,
  Clock,
  Bot,
  LogOut,
  ChevronRight,
  Star,
  X,
  Bell,
  Search as SearchIcon
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function Badge({ children }) {

  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
      {children}
    </span>
  );

}

function StatCard({ title, value, icon: Icon }) {

  return (

    <motion.div
      whileHover={{ y: -4 }}
      className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl backdrop-blur-sm"
    >

      <div className="flex justify-between items-start mb-4">

        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>

      </div>

      <p className="text-slate-400 text-sm font-medium mb-1">
        {title}
      </p>

      <p className="text-2xl font-bold tracking-tight">
        {value}
      </p>

    </motion.div>

  );

}

export default function UserDashboard() {
  return <DashboardContent />;
}

function DashboardContent() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [keyword, setKeyword] = useState("");

  const [assets, setAssets] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [savedAssets, setSavedAssets] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {

    setUser({
      username: "Sai",
      email: "sai@ipnexus.com",
      role: "User",
      avatar: "https://picsum.photos/seed/sai/100/100",
    });

  }, []);

  useEffect(() => {

    fetchAssets();

  }, []);

  const fetchAssets = async () => {

    setLoading(true);

    try {

      const response = await axios.get(
        "http://localhost:8081/api/search",
        {
          params: {
            q: "artificial intelligence",
            type: "PATENT",
            page: 0,
            size: 20
          }
        }
      );

      setAssets(response.data.results || []);

    } catch (error) {

      console.error("API Error:", error);

    } finally {

      setLoading(false);

    }

  };

  const filteredAssets = useMemo(() => {

    return assets.filter(asset => {

      return asset.title
        ?.toLowerCase()
        .includes(keyword.toLowerCase());

    });

  }, [keyword, assets]);

  const toggleSaveAsset = (asset) => {

    const exists = savedAssets.find(a => a.lensId === asset.lensId);

    if (exists)
      setSavedAssets(savedAssets.filter(a => a.lensId !== asset.lensId));
    else
      setSavedAssets([...savedAssets, asset]);

  };

  const sidebarItems = [

    { id: "dashboard", label: "Overview", icon: LayoutDashboard },

    { id: "search", label: "Patent Search", icon: Search },

    { id: "assets", label: "My Portfolio", icon: FileText },

    { id: "saved", label: "Watchlist", icon: Bookmark },

    { id: "analytics", label: "Insights", icon: BarChart3 },

    { id: "profile", label: "Profile", icon: User },

  ];

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (

    <div className="flex h-screen bg-black text-white">

      {/* SIDEBAR */}

      <aside className="w-64 bg-slate-950 border-r border-white/5 flex flex-col">

        <div className="p-6">

          <div className="flex items-center gap-3 mb-10">

            <ShieldCheck className="w-6 h-6 text-indigo-400" />

            <h2 className="text-xl font-bold">User</h2>

          </div>

          <nav className="space-y-1">

            {sidebarItems.map(({ id, label, icon: Icon }) => (

              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm ${
                  activeTab === id
                    ? "bg-indigo-600"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >

                <Icon className="w-4 h-4" />

                {label}

              </button>

            ))}

          </nav>

        </div>

        <div className="mt-auto p-6 border-t border-white/5">

          <div className="flex items-center gap-3 mb-6">

            <img
              src={user.avatar}
              className="w-10 h-10 rounded-full"
            />

            <div>

              <p className="text-sm font-bold">
                {user.username}
              </p>

              <p className="text-xs text-slate-500">
                {user.role}
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 w-full bg-white/5 hover:bg-red-500/20 py-2 rounded-xl"
          >

            <LogOut className="w-4 h-4" />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="flex-1 overflow-y-auto">

        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8">

          <p className="capitalize">
            {activeTab}
          </p>

          <Bell className="w-5 h-5 text-slate-400" />

        </header>

        <div className="p-8">

          {activeTab === "dashboard" && (

            <div className="grid grid-cols-4 gap-6">

              <StatCard
                title="Total Patents"
                value={assets.length}
                icon={FileText}
              />

              <StatCard
                title="Active"
                value={assets.filter(a => a.patentStatus === "ACTIVE").length}
                icon={ShieldCheck}
              />

              <StatCard
                title="Pending"
                value={assets.filter(a => a.patentStatus === "PENDING").length}
                icon={Clock}
              />

              <StatCard
                title="Discontinued"
                value={assets.filter(a => a.patentStatus === "DISCONTINUED").length}
                icon={Plus}
              />

            </div>

          )}

          {activeTab === "search" && (

            <div className="space-y-6">

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search patent..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3"
              />

              {loading && <p>Loading...</p>}

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredAssets.map(asset => (

                  <div
                    key={asset.lensId}
                    className="bg-slate-900 border border-white/10 p-6 rounded-xl"
                  >

                    <Badge>{asset.patentStatus}</Badge>

                    <h3 className="font-bold mt-2">
                      {asset.title}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {asset.applicants?.[0]} • {asset.jurisdiction}
                    </p>

                    <p className="text-xs text-slate-500">
                      {asset.datePublished}
                    </p>

                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="mt-4 text-indigo-400 text-sm"
                    >
                      Details
                    </button>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </main>

      {/* MODAL */}

      <AnimatePresence>

        {selectedAsset && (

          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center"
            onClick={() => setSelectedAsset(null)}
          >

            <motion.div
              className="bg-slate-900 p-8 rounded-xl max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="text-2xl font-bold mb-4">
                {selectedAsset.title}
              </h2>

              <p className="text-sm text-slate-400 mb-4">
                {selectedAsset.abstract}
              </p>

              <button
                onClick={() => setSelectedAsset(null)}
                className="mt-4 bg-indigo-600 px-4 py-2 rounded"
              >
                Close
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}