import { useAdminStore } from "@/store/useAdminStore";
import { 
  Users, 
  MessageSquare, 
  UserCheck, 
  UserX, 
  Shield,
  Activity,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardStats = () => {
  const { dashboardStats } = useAdminStore();

  if (!dashboardStats) {
    return (
      <div className="card p-6 text-center">
        <p className="text-muted-foreground">Loading dashboard statistics...</p>
      </div>
    );
  }

  const { users, messages, activity } = dashboardStats;

  // Prepare chart data for daily messages
  const dailyMessageLabels = activity.dailyMessages.map(item => 
    `${item._id.month}/${item._id.day}`
  );
  const dailyMessageData = activity.dailyMessages.map(item => item.count);

  const chartData = {
    labels: dailyMessageLabels,
    datasets: [
      {
        label: 'Messages per Day',
        data: dailyMessageData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
      title: {
        display: true,
        text: 'Message Activity (Last 7 Days)',
        color: 'rgb(255, 255, 255)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  const userTypeData = {
    labels: ['Active Users', 'Blocked Users', 'Admin Users'],
    datasets: [
      {
        data: [users.active, users.blocked, users.admins],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
      title: {
        display: true,
        text: 'User Distribution',
        color: 'rgb(255, 255, 255)',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">User Statistics</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Users</span>
              <span className="text-white font-medium">{users.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Active Users
              </span>
              <span className="text-green-400 font-medium">{users.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <UserX className="w-4 h-4" />
                Blocked Users
              </span>
              <span className="text-red-400 font-medium">{users.blocked}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Users
              </span>
              <span className="text-purple-400 font-medium">{users.admins}</span>
            </div>
            <div className="flex justify-between items-center border-t border-wild-700/30 pt-3">
              <span className="text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                New This Week
              </span>
              <span className="text-blue-400 font-medium">{users.recent}</span>
            </div>
          </div>
        </div>

        {/* Message Stats */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Message Statistics</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Messages</span>
              <span className="text-white font-medium">{messages.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Direct Messages</span>
              <span className="text-blue-400 font-medium">{messages.direct}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Group Messages</span>
              <span className="text-purple-400 font-medium">{messages.group}</span>
            </div>
            <div className="flex justify-between items-center border-t border-wild-700/30 pt-3">
              <span className="text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                This Week
              </span>
              <span className="text-green-400 font-medium">{messages.recent}</span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Messages/User Avg</span>
              <span className="text-white font-medium">
                {users.total > 0 ? Math.round(messages.total / users.total) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Block Rate</span>
              <span className="text-red-400 font-medium">
                {users.total > 0 ? ((users.blocked / users.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Admin Ratio</span>
              <span className="text-purple-400 font-medium">
                {users.total > 0 ? ((users.admins / users.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-wild-700/30 pt-3">
              <span className="text-muted-foreground">Growth Rate</span>
              <span className="text-green-400 font-medium">
                {users.total > 0 ? ((users.recent / users.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Activity Chart */}
        <div className="card p-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* User Distribution Chart */}
        <div className="card p-6">
          <Bar data={userTypeData} options={userTypeOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
