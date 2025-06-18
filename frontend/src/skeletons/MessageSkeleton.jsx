import { motion } from "framer-motion";
import "./MessageSkeleton.css"

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-sky-900/10 to-emerald-900/10 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {skeletonMessages.map((_, idx) => (
        <motion.div
          key={idx}
          className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className={`flex max-w-[80%] gap-3 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
            {/* Avatar with glow */}
            <div className="relative flex-shrink-0">
              <div className={`absolute inset-0 rounded-full blur-sm ${
                idx % 2 === 0 ? "bg-sky-500/20" : "bg-emerald-500/20"
              }`} />
              <div className="skeleton size-10 rounded-full relative z-10 bg-slate-700" />
            </div>
            
            {/* Message bubble */}
            <div className="flex flex-col gap-1">
              {/* Sender name */}
              <div className={`skeleton h-4 w-24 mb-1 rounded-full ${
                idx % 2 === 0 ? "bg-sky-800/50" : "bg-emerald-800/50"
              }`} />
              
              {/* Message content */}
              <div className={`rounded-2xl p-4 ${
                idx % 2 === 0 
                  ? "rounded-tl-none bg-slate-800/50 border border-sky-900/30" 
                  : "rounded-tr-none bg-emerald-900/20 border border-emerald-900/30"
              }`}>
                <div className="space-y-2">
                  <div className="skeleton h-3 w-full bg-slate-700/80 rounded-md" />
                  <div className="skeleton h-3 w-4/5 bg-slate-700/80 rounded-md" />
                  <div className="skeleton h-3 w-3/4 bg-slate-700/80 rounded-md" />
                </div>
              </div>
              
              {/* Timestamp */}
              <div className={`skeleton h-3 w-16 mt-1 rounded-full ${
                idx % 2 === 0 ? "ml-auto" : "mr-auto"
              } ${idx % 2 === 0 ? "bg-sky-900/30" : "bg-emerald-900/30"}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MessageSkeleton;