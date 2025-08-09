import { Check, CheckCheck } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

const MessageStatus = ({ message, isFromMe }) => {
  const { selectedChat } = useChatStore();
  
  if (!isFromMe) return null; // Only show status for sent messages

  const getStatusIcon = () => {
    if (selectedChat === "group") {
      // For group messages, show status based on seenBy array
      const seenCount = message.seenBy?.length || 0;
      
      if (seenCount > 0) {
        // Blue double tick if anyone has seen it
        return (
          <div className="flex items-center">
            <CheckCheck className="w-3 h-3 text-blue-400 drop-shadow-sm" />
            {seenCount > 1 && (
              <span className="text-xs ml-1 text-blue-400 font-medium">{seenCount}</span>
            )}
          </div>
        );
      } else {
        // White/light gray double tick for group messages (always delivered when sent)
        return (
          <div className="flex">
            <CheckCheck className="w-3 h-3 text-white/80 drop-shadow-sm" />
          </div>
        );
      }
    } else {
      // For direct messages
      if (message.read) {
        // Blue double tick for read messages
        return (
          <div className="flex">
            <CheckCheck className="w-3 h-3 text-blue-400 drop-shadow-sm" />
          </div>
        );
      } else if (message.delivered) {
        // White/light gray double tick for delivered but not read
        return (
          <div className="flex">
            <CheckCheck className="w-3 h-3 text-white/80 drop-shadow-sm" />
          </div>
        );
      } else {
        // Single white/light gray tick for sent but not delivered
        return (
          <div className="flex">
            <Check className="w-3 h-3 text-white/80 drop-shadow-sm" />
          </div>
        );
      }
    }
  };

  return (
    <div className="flex items-center ml-1">
      {getStatusIcon()}
    </div>
  );
};

export default MessageStatus;
