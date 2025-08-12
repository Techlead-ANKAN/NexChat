import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import { Navigate } from "react-router-dom";
import { 
  Users, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  UserX, 
  Activity,
  Calendar,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminUsersList from "@/components/admin/AdminUsersList";
import AdminMessagesList from "@/components/admin/AdminMessagesList";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminSystemManagement from "@/components/admin/AdminSystemManagement";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";

const AdminDashboard = () => {
  const { authUser } = useAuthStore();
  const { 
    dashboardStats, 
    getDashboardStats,
    isLoading 
  } = useAdminStore();
  
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect if not admin
  if (!authUser || authUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    getDashboardStats();
  }, [getDashboardStats]);

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      component: AdminDashboardStats
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      component: AdminUsersList
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      component: AdminMessagesList
    },
    {
      id: "system",
      label: "System",
      icon: Settings,
      component: AdminSystemManagement
    },
    {
      id: "audit",
      label: "Audit Logs", 
      icon: FileText,
      component: AdminAuditLogs
    }
  ];

  if (isLoading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wild-950 via-nature-950 to-wild-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wild-950 via-nature-950 to-wild-900 nature-pattern pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">
                Admin Dashboard
              </h1>
              <p className="text-wild-300">
                Manage users, moderate content, and monitor activity
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardStats.users.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardStats.messages.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <UserX className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked Users</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardStats.users.blocked}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recent Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboardStats.messages.recent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-wild-900/50 rounded-xl backdrop-blur-sm flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                  ${activeTab === tab.id
                    ? "bg-wild-600/30 text-white border border-wild-500/30"
                    : "text-wild-300 hover:text-white hover:bg-wild-800/30"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Component - Scrollable */}
        <div className="flex-1 bg-wild-900/30 rounded-xl border border-wild-700/30 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
