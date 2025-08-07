import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Trash2, 
  Eye,
  Users,
  User,
  Image,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const AdminMessagesList = () => {
  const { 
    messages, 
    messageFilters,
    currentPage,
    totalPages,
    totalMessages,
    isLoading,
    getAllMessages,
    setMessageFilters,
    deleteMessage
  } = useAdminStore();

  const [searchInput, setSearchInput] = useState(messageFilters.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages]);

  const handleSearch = (e) => {
    e.preventDefault();
    setMessageFilters({ search: searchInput, page: 1 });
    getAllMessages({ search: searchInput, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { [key]: value, page: 1 };
    setMessageFilters(newFilters);
    getAllMessages(newFilters);
  };

  const handlePageChange = (newPage) => {
    setMessageFilters({ page: newPage });
    getAllMessages({ page: newPage });
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      await deleteMessage(messageId);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="card p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Message Moderation</h2>
          <p className="text-wild-300">Monitor and moderate user messages</p>
        </div>
        
        <div className="flex gap-2">
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
              placeholder="Search message content..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chat Type
                </label>
                <select
                  value={messageFilters.chatType}
                  onChange={(e) => handleFilterChange("chatType", e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option value="all">All Messages</option>
                  <option value="direct">Direct Messages</option>
                  <option value="group">Group Messages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    const today = new Date();
                    let startDate = null;
                    
                    if (value === "today") {
                      startDate = new Date(today.setHours(0, 0, 0, 0));
                    } else if (value === "week") {
                      startDate = new Date(today.setDate(today.getDate() - 7));
                    } else if (value === "month") {
                      startDate = new Date(today.setMonth(today.getMonth() - 1));
                    }
                    
                    handleFilterChange("startDate", startDate?.toISOString());
                  }}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Results Per Page
                </label>
                <select
                  value={messageFilters.limit}
                  onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMessageFilters({ 
                      search: "", 
                      chatType: "all", 
                      startDate: "", 
                      endDate: "",
                      page: 1 
                    });
                    setSearchInput("");
                    getAllMessages({ 
                      search: "", 
                      chatType: "all", 
                      startDate: "", 
                      endDate: "",
                      page: 1 
                    });
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
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-xl font-bold text-white">{totalMessages}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Direct Messages</p>
              <p className="text-xl font-bold text-white">
                {messages.filter(msg => msg.chatType === 'direct').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Group Messages</p>
              <p className="text-xl font-bold text-white">
                {messages.filter(msg => msg.chatType === 'group').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-wild-800/30 border-b border-wild-700/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sender</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Receiver</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Content</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message._id} className="border-b border-wild-700/10 hover:bg-wild-800/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={message.senderId?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId?.fullName}`}
                          alt={message.senderId?.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {message.senderId?.fullName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {message.senderId?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {message.chatType === 'group' ? (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400">Group Chat</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={message.receiverId?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${message.receiverId?.fullName}`}
                            alt={message.receiverId?.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {message.receiverId?.fullName || 'Unknown User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {message.receiverId?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div>
                      {message.text && (
                        <p className="text-sm text-foreground mb-1">
                          {truncateText(message.text)}
                        </p>
                      )}
                      {message.image && (
                        <div className="flex items-center gap-1 text-xs text-blue-400">
                          <Image className="w-3 h-3" />
                          <span>Image attachment</span>
                        </div>
                      )}
                      {!message.text && !message.image && (
                        <span className="text-xs text-muted-foreground italic">No content</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      message.chatType === 'group' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {message.chatType === 'group' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {message.chatType === 'group' ? 'Group' : 'Direct'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      {message.image && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(message.image, '_blank')}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMessage(message._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages found</p>
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
    </div>
  );
};

export default AdminMessagesList;
