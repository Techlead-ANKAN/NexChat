import { motion } from "framer-motion";
import { Users, MessageCircle } from "lucide-react";
import "./SidebarSkeleton.css"

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);
  
  return (
    <motion.aside
      className="h-full w-20 lg:w-72 border-r border-slate-700 bg-black/30 backdrop-blur-xl flex flex-col transition-all duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with glass effect */}
      <div className="border-b border-slate-700 w-full p-4 bg-gradient-to-r from-sky-900/10 to-emerald-900/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-sm" />
            <MessageCircle className="w-6 h-6 relative z-10 text-sky-400" />
          </div>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300 hidden lg:block">
            NexChat
          </span>
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="p-3">
        <div className="relative">
          <div className="skeleton h-10 w-full rounded-xl bg-slate-800/50" />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="skeleton size-6 rounded-md" />
          </div>
        </div>
      </div>

      {/* Contact list skeleton */}
      <div className="overflow-y-auto w-full py-3 px-2">
        {skeletonContacts.map((_, idx) => (
          <motion.div
            key={idx}
            className="w-full p-3 flex items-center gap-3 rounded-xl hover:bg-slate-800/30 transition-all duration-200"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {/* Avatar skeleton with glow */}
            <div className="relative mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 to-emerald-500/30 rounded-full blur-sm animate-pulse" />
              <div className="skeleton size-12 rounded-full relative z-10 bg-slate-700" />
            </div>

            {/* User info skeleton */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 bg-slate-600 rounded-md" />
              <div className="skeleton h-3 w-16 bg-slate-700 rounded-md" />
            </div>
            
            {/* Status indicator skeleton */}
            <div className="hidden lg:block ml-auto">
              <div className="skeleton size-3 rounded-full bg-emerald-400/50" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="mt-auto p-3 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton size-10 rounded-full" />
            <div className="hidden lg:block">
              <div className="skeleton h-4 w-24 mb-1" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
          <div className="skeleton size-8 rounded-lg" />
        </div>
      </div>
    </motion.aside>
  );
};

export default SidebarSkeleton;