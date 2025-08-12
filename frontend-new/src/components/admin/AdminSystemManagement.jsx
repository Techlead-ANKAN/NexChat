import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Database, HardDrive, RefreshCw, Download, Shield, MessageSquare, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const AdminSystemManagement = () => {
  const [clearStats, setClearStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isClearingMessages, setIsClearingMessages] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [clearProgress, setClearProgress] = useState(null);

  // Load clear messages statistics
  const loadClearStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await axiosInstance.get("/admin/messages/clear/stats");
      setClearStats(response.data);
    } catch (error) {
      console.error("Error loading clear stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadClearStats();
  }, []);

  // Handle clear all messages
  const handleClearAllMessages = async () => {
    if (confirmationText !== "DELETE ALL MESSAGES") {
      toast.error("Please type 'DELETE ALL MESSAGES' to confirm");
      return;
    }

    setIsClearingMessages(true);
    setClearProgress({ step: "Preparing", progress: 0 });

    try {
      // Simulate progress updates
      const progressUpdates = [
        { step: "Analyzing messages", progress: 20 },
        { step: "Cleaning Cloudinary storage", progress: 60 },
        { step: "Clearing database", progress: 90 },
        { step: "Finalizing", progress: 100 }
      ];

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < progressUpdates.length) {
          setClearProgress(progressUpdates[currentStep]);
          currentStep++;
        }
      }, 1000);

      const response = await axiosInstance.delete("/admin/messages/clear/all", {
        data: { confirmation: confirmationText }
      });

      clearInterval(progressInterval);
      setClearProgress({ step: "Complete", progress: 100 });

      // Show success message
      toast.success(
        `Successfully cleared ${response.data.stats.messagesDeleted} messages and ${response.data.stats.imagesDeleted} images`,
        { duration: 6000 }
      );

      // Reset states
      setShowConfirmation(false);
      setConfirmationText("");
      setClearProgress(null);
      
      // Reload stats
      loadClearStats();

    } catch (error) {
      console.error("Error clearing messages:", error);
      setClearProgress(null);
      toast.error(error.response?.data?.error || "Failed to clear messages");
    } finally {
      setIsClearingMessages(false);
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">System Management</h2>
          <p className="text-muted-foreground">Manage system data and storage</p>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="border-wild-800/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <HardDrive className="w-5 h-5" />
            Storage Statistics
            <Button
              variant="outline"
              size="sm"
              onClick={loadClearStats}
              disabled={isLoadingStats}
              className="ml-auto"
            >
              {isLoadingStats ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : clearStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-wild-900/50 rounded-lg border border-wild-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">Messages</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {clearStats.stats.totalMessages.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {clearStats.stats.messagesWithImages.toLocaleString()} with images
                </p>
              </div>

              <div className="p-4 bg-wild-900/50 rounded-lg border border-wild-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-white">Users</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {clearStats.stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {clearStats.stats.usersWithProfilePics.toLocaleString()} with profile pics
                </p>
              </div>

              <div className="p-4 bg-wild-900/50 rounded-lg border border-wild-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-white">Date Range</span>
                </div>
                <p className="text-sm text-purple-400">
                  {formatDate(clearStats.stats.dateRange.oldest)}
                </p>
                <p className="text-sm text-muted-foreground">
                  to {formatDate(clearStats.stats.dateRange.newest)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Failed to load statistics
            </p>
          )}
        </CardContent>
      </Card>

      {/* Clear Messages Section */}
      <Card className="border-red-800/30 bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/30">
            <h3 className="font-semibold text-red-400 mb-2">Clear All Messages</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action will permanently delete all messages from the system and clean up 
              associated images from Cloudinary storage. User accounts and profile pictures will be preserved.
            </p>
            
            {clearStats && (
              <div className="bg-wild-900/50 p-3 rounded border border-wild-800/30 mb-4">
                <h4 className="font-medium text-white mb-2">What will be affected:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2 text-red-400">
                    <Trash2 className="w-3 h-3" />
                    {clearStats.stats.totalMessages.toLocaleString()} messages will be deleted
                  </li>
                  <li className="flex items-center gap-2 text-red-400">
                    <Trash2 className="w-3 h-3" />
                    {clearStats.stats.messagesWithImages.toLocaleString()} images from Cloudinary
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <Shield className="w-3 h-3" />
                    {clearStats.stats.usersWithProfilePics.toLocaleString()} profile pictures will be preserved
                  </li>
                  <li className="flex items-center gap-2 text-green-400">
                    <Shield className="w-3 h-3" />
                    {clearStats.stats.totalUsers.toLocaleString()} user accounts will be preserved
                  </li>
                </ul>
              </div>
            )}

            <Button
              variant="destructive"
              onClick={() => setShowConfirmation(true)}
              disabled={isClearingMessages || !clearStats || clearStats.stats.totalMessages === 0}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isClearingMessages && setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-wild-900 border border-red-800/30 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Confirm Message Deletion</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>

              {clearProgress ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-white mb-2">{clearProgress.step}</p>
                    <div className="w-full bg-wild-800 rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${clearProgress.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {clearProgress.progress}% complete
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-red-950/30 rounded border border-red-800/30">
                    <p className="text-sm text-red-300">
                      Type <strong>"DELETE ALL MESSAGES"</strong> to confirm:
                    </p>
                  </div>

                  <Input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE ALL MESSAGES"
                    className="font-mono"
                    disabled={isClearingMessages}
                  />

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmation(false)}
                      disabled={isClearingMessages}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleClearAllMessages}
                      disabled={confirmationText !== "DELETE ALL MESSAGES" || isClearingMessages}
                      className="flex-1"
                    >
                      {isClearingMessages ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete All
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSystemManagement;
