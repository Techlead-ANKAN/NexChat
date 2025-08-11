import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { 
  Search, 
  Filter, 
  UserX, 
  UserCheck, 
  Shield, 
  Eye,
  MoreVertical,
  Ban,
  CheckCircle,
  Crown,
  Users,
  X,
  Calendar,
  MessageCircle,
  Send,
  Inbox,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const AdminUsersList = () => {
  const { 
    users, 
    userFilters,
    currentPage,
    totalPages,
    totalUsers,
    isLoading,
    selectedUser,
    getAllUsers,
    setUserFilters,
    toggleUserBlock,
    promoteToAdmin,
    getUserDetails,
    clearSelectedUser,
    sendWarning
  } = useAdminStore();

  const [searchInput, setSearchInput] = useState(userFilters.search);
  const [showFilters, setShowFilters] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningUser, setWarningUser] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningSeverity, setWarningSeverity] = useState("moderate");
  const [isWarningLoading, setIsWarningLoading] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setUserFilters({ search: searchInput, page: 1 });
    getAllUsers({ search: searchInput, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { [key]: value, page: 1 };
    setUserFilters(newFilters);
    getAllUsers(newFilters);
  };

  const handlePageChange = (newPage) => {
    setUserFilters({ page: newPage });
    getAllUsers({ page: newPage });
  };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'block':
        case 'unblock':
          await toggleUserBlock(userId);
          break;
        case 'promote':
          await promoteToAdmin(userId);
          break;
        case 'view':
          await getUserDetails(userId);
          break;
        case 'warn':
          const user = users.find(u => u._id === userId);
          setWarningUser(user);
          setShowWarningModal(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleSendWarning = async () => {
    if (!warningMessage.trim() || !warningUser) return;
    
    setIsWarningLoading(true);
    try {
      await sendWarning(warningUser._id, warningMessage.trim(), warningSeverity);
      
      setShowWarningModal(false);
      setWarningMessage("");
      setWarningSeverity("moderate");
      setWarningUser(null);
      // Refresh users list to show updated warning count
      getAllUsers();
    } catch (error) {
      console.error('Error sending warning:', error);
    } finally {
      setIsWarningLoading(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="card p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">User Management</h2>
          <p className="text-wild-300">Manage users, view details, and moderate accounts</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setUserFilters({ limit: undefined, page: 1 });
              getAllUsers({ limit: undefined, page: 1 });
            }}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Show All Users
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Search
          </Button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="card p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Status
                </label>
                <select
                  value={userFilters.blocked || ""}
                  onChange={(e) => handleFilterChange("blocked", e.target.value || undefined)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option value="">All Users</option>
                  <option value="false">Active Users</option>
                  <option value="true">Blocked Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Results Per Page
                </label>
                <select
                  value={userFilters.limit}
                  onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                  <option value={1000}>Show All</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserFilters({ search: "", blocked: undefined, page: 1 });
                    setSearchInput("");
                    getAllUsers({ search: "", blocked: undefined, page: 1 });
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-xl font-bold text-white">{totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <UserX className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm text-muted-foreground">Blocked Users</p>
              <p className="text-xl font-bold text-white">
                {users.filter(user => user.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Admin Users</p>
              <p className="text-xl font-bold text-white">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Display Status */}
      <div className="flex items-center justify-between text-sm text-wild-300 bg-wild-900/30 rounded-lg p-3">
        <span>
          Showing {users.length} of {totalUsers} users
          {userFilters.search && ` (filtered by "${userFilters.search}")`}
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-wild-800/30 border-b border-wild-700/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Warnings</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-wild-700/10 hover:bg-wild-800/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">ID: {user._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield className="w-4 h-4 text-purple-400" />}
                      <span className={`text-sm font-medium ${
                        user.role === 'admin' ? 'text-purple-400' : 'text-foreground'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.isBlocked ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {user.warningCount > 0 ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.warningCount >= 3 
                            ? 'bg-red-500/20 text-red-400' 
                            : user.warningCount >= 2
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          <AlertTriangle className="w-3 h-3" />
                          {user.warningCount}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction(user._id, 'view')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {user.role !== 'admin' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user._id, 'warn')}
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Send Warning"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user._id, user.isBlocked ? 'unblock' : 'block')}
                            className={user.isBlocked ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}
                          >
                            {user.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </Button>
                          
                          {!user.isBlocked && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction(user._id, 'promote')}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Crown className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="modal-content rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--muted)] rounded-t-lg">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">User Details</h2>
              <button
                onClick={clearSelectedUser}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1 rounded-md hover:bg-[var(--border)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 bg-[var(--background)] rounded-b-lg">
              {/* User Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture and Basic Info */}
                <div className="space-y-4 bg-[var(--muted)] p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                      {selectedUser.user?.profilePic ? (
                        <img 
                          src={selectedUser.user.profilePic} 
                          alt={selectedUser.user.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {selectedUser.user?.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {selectedUser.user?.fullName}
                      </h3>
                      <p className="text-[var(--muted-foreground)]">
                        {selectedUser.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.user?.role === 'admin' 
                        ? 'bg-[var(--primary)] text-white' 
                        : 'bg-[var(--muted)] text-[var(--foreground)]'
                    }`}>
                      {selectedUser.user?.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.user?.isBlocked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedUser.user?.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4 bg-[var(--muted)] p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">User ID</label>
                    <p className="text-[var(--foreground)] font-mono text-sm bg-[var(--input)] p-2 rounded border border-[var(--border)]">
                      {selectedUser.user?._id}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Account Created</label>
                    <div className="flex items-center gap-2 text-[var(--foreground)]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedUser.user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Last Updated</label>
                    <div className="flex items-center gap-2 text-[var(--foreground)]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedUser.user?.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selectedUser.user?.isBlocked && selectedUser.user?.blockedAt && (
                    <div>
                      <label className="text-sm font-medium text-[var(--muted-foreground)]">Blocked Date</label>
                      <div className="flex items-center gap-2 text-red-400">
                        <Ban className="w-4 h-4" />
                        <span>{new Date(selectedUser.user.blockedAt).toLocaleDateString()}</span>
                      </div>
                      {selectedUser.user?.blockedBy && (
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                          Blocked by: {selectedUser.user.blockedBy.fullName} ({selectedUser.user.blockedBy.email})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Statistics */}
              <div className="border-t border-[var(--border)] pt-6 bg-[var(--background)] rounded-lg">
                <h4 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2 px-4">
                  <MessageCircle className="w-5 h-5" />
                  Message Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-4">
                  <div className="bg-[var(--muted)] p-4 rounded-lg border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Total Messages</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {selectedUser.stats?.totalMessages || 0}
                    </p>
                  </div>
                  <div className="bg-[var(--muted)] p-4 rounded-lg border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Send className="w-5 h-5" />
                      <span className="font-medium">Sent</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {selectedUser.stats?.sentMessages || 0}
                    </p>
                  </div>
                  <div className="bg-[var(--muted)] p-4 rounded-lg border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <Inbox className="w-5 h-5" />
                      <span className="font-medium">Received</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {selectedUser.stats?.receivedMessages || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[var(--border)] pt-6 bg-[var(--muted)] rounded-lg p-4">
                <div className="flex flex-wrap gap-3">
                  {selectedUser.user?.role !== 'admin' && (
                    <>
                      <Button
                        onClick={() => {
                          handleUserAction(selectedUser.user._id, selectedUser.user.isBlocked ? 'unblock' : 'block');
                          clearSelectedUser();
                        }}
                        variant="outline"
                        className={`flex items-center gap-2 ${
                          selectedUser.user?.isBlocked 
                            ? 'text-green-400 border-green-400 hover:bg-green-400/10' 
                            : 'text-red-400 border-red-400 hover:bg-red-400/10'
                        }`}
                      >
                        {selectedUser.user?.isBlocked ? (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Unblock User
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4" />
                            Block User
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => {
                          handleUserAction(selectedUser.user._id, 'promote');
                          clearSelectedUser();
                        }}
                        variant="outline"
                        className="flex items-center gap-2 text-amber-400 border-amber-400 hover:bg-amber-400/10"
                      >
                        <Crown className="w-4 h-4" />
                        Promote to Admin
                      </Button>
                    </>
                  )}
                  
                  <Button
                    onClick={clearSelectedUser}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && warningUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-wild-900/95 backdrop-blur-lg border border-wild-700/50 rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-wild-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Send Warning
                  </h3>
                  <p className="text-sm text-wild-300">
                    To {warningUser.fullName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningMessage("");
                  setWarningSeverity("moderate");
                  setWarningUser(null);
                }}
                className="text-wild-400 hover:text-white hover:bg-wild-800/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* User Info Card */}
              <div className="bg-wild-800/30 rounded-lg p-4 border border-wild-700/20">
                <div className="flex items-center gap-3">
                  <img
                    src={warningUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${warningUser.fullName}`}
                    alt={warningUser.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-wild-600"
                  />
                  <div>
                    <p className="font-medium text-white">{warningUser.fullName}</p>
                    <p className="text-sm text-wild-400">{warningUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Severity Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Warning Severity
                </label>
                <select
                  value={warningSeverity}
                  onChange={(e) => setWarningSeverity(e.target.value)}
                  className="w-full p-3 rounded-lg bg-wild-800/50 border border-wild-600/50 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                  style={{
                    colorScheme: 'dark'
                  }}
                >
                  <option value="mild" className="bg-wild-800 text-white">⚠️ Mild - Gentle reminder</option>
                  <option value="moderate" className="bg-wild-800 text-white">⚠️ Moderate - Official warning</option>
                  <option value="severe" className="bg-wild-800 text-white">🚨 Severe - Final warning</option>
                </select>
                
                {/* Severity Description */}
                <div className="text-xs text-wild-400 bg-wild-800/20 rounded-lg p-3">
                  {warningSeverity === 'mild' && "A friendly reminder about community guidelines."}
                  {warningSeverity === 'moderate' && "An official warning that will be recorded in the user's profile."}
                  {warningSeverity === 'severe' && "A final warning before potential account restrictions."}
                </div>
              </div>

              {/* Warning Message */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Warning Message
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Describe the violation and provide guidance for improvement..."
                  className="w-full p-3 rounded-lg bg-wild-800/50 border border-wild-600/50 text-white placeholder-wild-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none min-h-[120px] resize-y transition-all duration-200"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-wild-400">
                    {warningMessage.length}/500 characters
                  </p>
                  <div className={`text-xs font-medium ${
                    warningMessage.length > 450 ? 'text-red-400' : 
                    warningMessage.length > 400 ? 'text-yellow-400' : 'text-wild-400'
                  }`}>
                    {500 - warningMessage.length} remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-wild-700/30 bg-wild-800/20">
              <Button
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningMessage("");
                  setWarningSeverity("moderate");
                  setWarningUser(null);
                }}
                variant="outline"
                className="flex-1 border-wild-600/50 text-wild-300 hover:text-white hover:border-wild-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendWarning}
                disabled={!warningMessage.trim() || isWarningLoading}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isWarningLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>Send Warning</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
