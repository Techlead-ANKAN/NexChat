import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, Save } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const EmailChangeForm = ({ authUser, onUpdateEmail, isUpdating }) => {
  const [formData, setFormData] = useState({
    newEmail: "",
    currentPassword: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newEmail) {
      newErrors.newEmail = "New email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.newEmail = "Please enter a valid email address";
    } else if (formData.newEmail === authUser?.email) {
      newErrors.newEmail = "New email must be different from current email";
    }
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onUpdateEmail(formData);
      setFormData({ newEmail: "", currentPassword: "" });
      setErrors({});
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-nature-400" />
          Update Email Address
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Email</label>
            <Input
              type="email"
              value={authUser?.email || ""}
              className="bg-muted/50 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">New Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                name="newEmail"
                placeholder="Enter new email address"
                value={formData.newEmail}
                onChange={handleChange}
                className={`pl-9 ${errors.newEmail ? 'border-destructive' : ''}`}
                required
              />
            </div>
            {errors.newEmail && (
              <p className="text-sm text-destructive">{errors.newEmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <Input
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'border-destructive' : ''}
              required
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Required for security verification
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailChangeForm;
