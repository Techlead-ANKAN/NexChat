import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, TreePine, User, Mail, Lock, Save, Settings } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import EmailChangeForm from "@/components/profile/EmailChangeForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateEmail, updatePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [fullNameData, setFullNameData] = useState({
    fullName: authUser?.fullName || "",
  });

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "picture", label: "Picture", icon: Camera },
  ];

  const handleFullNameUpdate = async (e) => {
    e.preventDefault();
    if (!fullNameData.fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    
    if (fullNameData.fullName === authUser?.fullName) {
      toast.error("Name is the same as current name");
      return;
    }

    try {
      await updateProfile({ fullName: fullNameData.fullName });
    } catch (error) {
      // Error is handled in the store
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-nature-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFullNameUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Your photographer name"
                        value={fullNameData.fullName}
                        onChange={(e) => setFullNameData({ fullName: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={authUser?.email || ""}
                        className="pl-9 bg-muted/50 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Go to Security tab to change your email address
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isUpdatingProfile || fullNameData.fullName === authUser?.fullName}
                  >
                    {isUpdatingProfile ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Name
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <EmailChangeForm 
              authUser={authUser}
              onUpdateEmail={updateEmail}
              isUpdating={isUpdatingProfile}
            />
            <PasswordChangeForm 
              onUpdatePassword={updatePassword}
              isUpdating={isUpdatingProfile}
            />
          </div>
        );

      case "picture":
        return (
          <ProfilePictureUpload 
            authUser={authUser}
            onUpdateProfile={updateProfile}
            isUpdating={isUpdatingProfile}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-nature-500 to-gold-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Profile Settings
            </h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-20 right-10 animate-float">
          <TreePine className="w-16 h-16 text-nature-500/10" />
        </div>
        <div className="absolute bottom-20 left-10 animate-float" style={{ animationDelay: '3s' }}>
          <Camera className="w-12 h-12 text-gold-500/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-4 gap-6"
        >
          {/* Sidebar with Tabs */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          activeTab === tab.id
                            ? 'bg-nature-600/20 text-nature-400 border-r-2 border-nature-500'
                            : 'text-muted-foreground hover:text-white hover:bg-wild-800/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
