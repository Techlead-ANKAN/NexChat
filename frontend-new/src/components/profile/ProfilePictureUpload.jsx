import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, Upload, User, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePictureUpload = ({ authUser, onUpdateProfile, isUpdating }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      toast.error("Please select an image");
      return;
    }

    await onUpdateProfile({ profilePic: selectedImg });
    setSelectedImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setSelectedImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-nature-400" />
          Profile Picture
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={isUpdating}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Photo
              </Button>
              
              {selectedImg && (
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isUpdating}
                  className="bg-nature-600 hover:bg-nature-700"
                >
                  {isUpdating ? <LoadingSpinner size="sm" /> : "Upload"}
                </Button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
