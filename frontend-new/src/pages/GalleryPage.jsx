import { motion } from "framer-motion";
import { Camera, TreePine, ImageIcon, Heart, Share, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-nature-500 to-gold-500 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Wildlife Photography Galleries
            </h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Discover stunning wildlife photography from our community
          </p>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-20 right-10 animate-float">
          <Camera className="w-16 h-16 text-nature-500/10" />
        </div>
        <div className="absolute bottom-20 left-10 animate-float" style={{ animationDelay: '2s' }}>
          <TreePine className="w-12 h-12 text-gold-500/10" />
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-nature-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Photo Galleries Coming Soon
              </h2>
              
              <p className="text-muted-foreground mb-6">
                We're preparing an amazing gallery experience where photographers can showcase their wildlife captures, organize expeditions, and share their adventures.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-nature-300">
                  <Camera className="w-4 h-4" />
                  <span>High-resolution photo sharing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-nature-300">
                  <Heart className="w-4 h-4" />
                  <span>Community voting and favorites</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-nature-300">
                  <Share className="w-4 h-4" />
                  <span>Social sharing capabilities</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-nature-300">
                  <Eye className="w-4 h-4" />
                  <span>Detailed photo metadata viewing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;
