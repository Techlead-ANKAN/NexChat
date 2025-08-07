import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Settings, 
  Palette, 
  Zap,
  TreePine,
  Snowflake,
  Sun
} from "lucide-react";
import { motion } from "framer-motion";

const THEMES = [
  {
    value: "tiger-stripes",
    label: "Tiger Stripes",
    description: "Bold orange and charcoal inspired by majestic tigers",
    icon: Zap,
    colors: ["#e8763b", "#2c1810", "#ffaa44"]
  },
  {
    value: "forest-depths", 
    label: "Forest Depths",
    description: "Deep emerald greens from dense jungle canopies",
    icon: TreePine,
    colors: ["#0d4f3c", "#1a6b52", "#2d8659"]
  },
  {
    value: "arctic-wolf",
    label: "Arctic Wolf",
    description: "Cool steel-blue tones of winter wilderness",
    icon: Snowflake,
    colors: ["#3d5a80", "#98c1d9", "#e0fbfc"]
  },
  {
    value: "golden-savanna",
    label: "Golden Savanna",
    description: "Warm earth tones of African wildlife landscapes",
    icon: Sun,
    colors: ["#d4a574", "#8b5a3c", "#f4e4bc"]
  }
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-nature-500/20 to-gold-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-nature-500/20">
              <Settings className="w-6 h-6 text-nature-400" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-semibold text-foreground">
                Appearance
              </h1>
              <p className="text-muted-foreground font-body">
                Choose your wildlife photography theme
              </p>
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl border-wild-800/20 shadow-2xl bg-card/40">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-body font-medium text-foreground flex items-center gap-3">
                <Palette className="w-5 h-5 text-nature-400" />
                Wildlife Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {THEMES.map((themeOption) => {
                  const IconComponent = themeOption.icon;
                  return (
                    <motion.button
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        theme === themeOption.value
                          ? 'border-nature-500/50 bg-nature-500/10 shadow-lg shadow-nature-500/20'
                          : 'border-wild-800/30 hover:border-wild-700/50 bg-card/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          theme === themeOption.value
                            ? 'bg-nature-500/20 text-nature-400'
                            : 'bg-wild-800/30 text-muted-foreground'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-body font-medium text-foreground text-lg mb-1">
                            {themeOption.label}
                          </h3>
                          <p className="text-sm text-muted-foreground font-body leading-relaxed">
                            {themeOption.description}
                          </p>
                          <div className="flex gap-2 mt-3">
                            {themeOption.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-5 h-5 rounded-full border-2 border-wild-700/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        {theme === themeOption.value && (
                          <div className="w-3 h-3 rounded-full bg-nature-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
