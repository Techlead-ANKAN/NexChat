import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../ui/LoadingSpinner";

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditStats, setAuditStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: "",
    adminId: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditStats();
  }, [filters.page, filters.action, filters.startDate, filters.endDate]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      console.log("Fetching audit logs with params:", params.toString());
      const response = await axiosInstance.get(`/admin/audit/logs?${params}`);
      console.log("Audit logs response:", response.data);
      setAuditLogs(response.data.logs || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to fetch audit logs");
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      console.log("Fetching audit stats...");
      const response = await axiosInstance.get("/admin/audit/stats?days=30");
      console.log("Audit stats response:", response.data);
      setAuditStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching audit stats:", error);
      setAuditStats(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      "BULK_MESSAGE_DELETION": "bg-red-100 text-red-800",
      "USER_BLOCKED": "bg-yellow-100 text-yellow-800",
      "USER_UNBLOCKED": "bg-green-100 text-green-800",
      "USER_DELETED": "bg-red-100 text-red-800",
      "MESSAGE_DELETED": "bg-orange-100 text-orange-800",
      "ADMIN_LOGIN": "bg-blue-100 text-blue-800",
      "ADMIN_SETTINGS_CHANGE": "bg-purple-100 text-purple-800"
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStatCard = (title, value, description) => (
    <div className="bg-base-200 p-4 rounded-lg shadow border border-base-300">
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      <p className="text-2xl font-bold text-blue-400">{value}</p>
      <p className="text-sm text-base-content/70">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-base-100 min-h-screen">
      {/* Stats Overview */}
      {auditStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {renderStatCard(
            "Total Actions",
            auditStats.totalActions,
            "Last 30 days"
          )}
          {renderStatCard(
            "Bulk Deletions",
            auditStats.recentBulkDeletions?.length || 0,
            "Recent operations"
          )}
          {renderStatCard(
            "Action Types",
            auditStats.actionsByType?.length || 0,
            "Different types"
          )}
          {renderStatCard(
            "Active Admins",
            auditStats.actionsByAdmin?.length || 0,
            "Performed actions"
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg shadow border border-base-300">
        <h3 className="text-lg font-semibold mb-4 text-base-content">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content mb-1">
              Action Type
            </label>
            <div className="relative">
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white 
                           appearance-none cursor-pointer pr-8 focus:outline-none focus:border-blue-500"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="" className="bg-gray-700 text-white">All Actions</option>
                <option value="BULK_MESSAGE_DELETION" className="bg-gray-700 text-white">Bulk Message Deletion</option>
                <option value="USER_BLOCKED" className="bg-gray-700 text-white">User Blocked</option>
                <option value="USER_UNBLOCKED" className="bg-gray-700 text-white">User Unblocked</option>
                <option value="USER_DELETED" className="bg-gray-700 text-white">User Deleted</option>
                <option value="MESSAGE_DELETED" className="bg-gray-700 text-white">Message Deleted</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white
                         focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white
                         focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  action: "",
                  adminId: "",
                  startDate: "",
                  endDate: "",
                  page: 1,
                  limit: 20
                });
              }}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-base-200 rounded-lg shadow border border-base-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-base-300">
          <h3 className="text-lg font-semibold text-base-content">Audit Logs</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-base-content/70">
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-12 w-12 text-base-content/30" />
                        <p className="text-lg font-medium">No audit logs found</p>
                        <p className="text-sm">
                          {filters.action || filters.startDate || filters.endDate 
                            ? "Try adjusting your filters" 
                            : "No administrative actions have been recorded yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <motion.tr
                      key={log._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-base-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionBadgeColor(log.action)}`}>
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-base-content">
                            {log.adminName}
                          </div>
                          <div className="text-sm text-base-content/70">
                            {log.adminEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-base-content">
                        {log.action === "BULK_MESSAGE_DELETION" && log.stats && (
                          <div className="space-y-1">
                            <div>Messages deleted: {log.stats.messagesDeleted}</div>
                            <div>Images deleted: {log.stats.imagesDeletedFromCloudinary}</div>
                            <div>Profiles preserved: {log.stats.profilePicturesPreserved}</div>
                          </div>
                        )}
                        {log.targetUserName && (
                          <div>Target: {log.targetUserName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.errorMessages && log.errorMessages.length > 0 ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            With Warnings
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Success
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-base-300 bg-base-200 flex items-center justify-between">
            <div className="text-sm text-base-content">
              Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
              {Math.min(pagination.currentPage * filters.limit, pagination.totalLogs)} of{" "}
              {pagination.totalLogs} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange("page", pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 border border-base-300 rounded-lg hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 border border-base-300 rounded-lg">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handleFilterChange("page", pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-sm font-medium text-base-content bg-base-100 border border-base-300 rounded-lg hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
