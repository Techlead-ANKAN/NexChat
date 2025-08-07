import { useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Camera, Send, X, TreePine, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="message-input backdrop-blur-sm border-t p-4">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="card rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>Wildlife Photo Preview</span>
              </div>
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs max-h-40 object-cover rounded-lg shadow-lg border"
                  style={{ borderColor: 'hsl(var(--border))' }}
                />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Form */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        <div className="flex-1 relative">
          {/* Input Field */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Share your wildlife experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 py-3 resize-none form-input"
            />
            <TreePine className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          </div>
        </div>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Image Upload Button */}
        <Button
          type="button"
          variant={imagePreview ? "default" : "secondary"}
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="relative"
        >
          <Camera className="w-4 h-4" />
          {imagePreview && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />
          )}
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="relative"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Quick Actions */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <span>Press</span>
        <kbd className="px-2 py-1 rounded border font-mono" style={{ 
          backgroundColor: 'hsl(var(--muted))', 
          borderColor: 'hsl(var(--border))',
          color: 'hsl(var(--primary))'
        }}>
          Enter
        </kbd>
        <span>to send •</span>
        <Camera className="w-3 h-3" />
        <span>to share photos</span>
      </div>
    </div>
  );
};

export default MessageInput;
