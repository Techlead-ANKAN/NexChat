import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Image, X, Send } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";
import "./MessageInput.css";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear input state after sending
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="message-input-container">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            className="image-preview-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="preview-image-wrapper">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="preview-image"
              />
              <button 
                className="remove-image-button"
                onClick={removeImage}
              >
                <X className="remove-icon" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <form 
        className={`input-form ${isFocused ? "focused" : ""}`}
        onSubmit={handleSendMessage}
      >
        <div className="input-glow" />
        
        {/* Attachment Button */}
        <motion.button
          type="button"
          className="attachment-button"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Paperclip className="button-icon" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden-input"
          />
        </motion.button>
        
        {/* Text Input */}
        <div className="text-input-wrapper">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="text-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {!text && (
            <div className="placeholder-hint">
              <Image className="hint-icon" />
              <span>or attach an image</span>
            </div>
          )}
        </div>
        
        {/* Send Button */}
        <motion.button
          type="submit"
          className="send-button"
          disabled={!text.trim() && !imagePreview}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="send-icon" />
          <div className="send-glow" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;