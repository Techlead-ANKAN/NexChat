import { Camera, TreePine, Users, MessageCircle, Mountain, Binoculars } from "lucide-react";
import { motion } from "framer-motion";

const WelcomeScreen = () => {
  const features = [
    {
      icon: Users,
      title: "Join community discussions",
      description: "Connect with wildlife photographers worldwide"
    },
    {
      icon: Camera,
      title: "Share your wildlife captures",
      description: "Show off your best nature photography"
    },
    {
      icon: TreePine,
      title: "Connect with nature lovers",
      description: "Find like-minded conservation enthusiasts"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <TreePine className="w-8 h-8" style={{ color: 'hsl(var(--primary) / 0.2)' }} />
        </div>
        <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '1s' }}>
          <Mountain className="w-12 h-12" style={{ color: 'hsl(var(--primary) / 0.15)' }} />
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Camera className="w-6 h-6" style={{ color: 'hsl(var(--accent) / 0.25)' }} />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '3s' }}>
          <Binoculars className="w-10 h-10" style={{ color: 'hsl(var(--primary) / 0.15)' }} />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md mx-auto text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--primary))] rounded-2xl flex items-center justify-center shadow-2xl animate-float">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center animate-pulse">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl lg:text-5xl font-display font-bold mb-4"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--primary))] bg-clip-text text-transparent">
            "Wild By Nature"
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg mb-8 leading-relaxed"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          Connect with fellow wildlife photographers and nature enthusiasts from around the world
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4 mb-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-200"
                style={{ 
                  background: 'hsl(var(--muted) / 0.3)',
                  borderColor: 'hsl(var(--border) / 0.3)'
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ background: 'hsl(var(--primary) / 0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <div className="text-left">
                  <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{feature.title}</div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{feature.description}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-sm"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          Select a photographer from the sidebar to start chatting
        </motion.div>
      </motion.div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--background)/0.5)] via-[hsl(var(--muted)/0.2)] to-transparent">
        <div className="flex justify-center items-end h-full pb-4 gap-8 opacity-10">
          <Mountain className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
          <TreePine className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} />
          <Camera className="w-6 h-6" style={{ color: 'hsl(var(--accent))' }} />
          <TreePine className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} />
          <Mountain className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
