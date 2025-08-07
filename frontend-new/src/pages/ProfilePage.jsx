import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, TreePine, Upload, User, Mail, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        fullName: formData.fullName,
        profilePic: selectedImg,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const removeImage = () => {
    setSelectedImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-nature-500 to-gold-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Photographer Profile
            </h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Update your profile information and showcase your wildlife photography
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
        >
          <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-nature-400" />
                Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">Profile Picture</label>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-2 border-wild-700 overflow-hidden bg-gradient-to-br from-nature-500/20 to-gold-500/20">
                        {selectedImg || authUser?.profilePic ? (
                          <img
                            src={selectedImg || authUser.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {(selectedImg || authUser?.profilePic) && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-wild-700 hover:border-nature-500"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Your photographer name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                        value={formData.email}
                        className="pl-9 bg-muted/50 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
