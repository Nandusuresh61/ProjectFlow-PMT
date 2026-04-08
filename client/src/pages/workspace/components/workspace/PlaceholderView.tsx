import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export const PlaceholderView = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="w-40 h-40 bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center text-[#A5D7E8]"
    >
      <Zap size={60} className="opacity-40" />
    </motion.div>
    <div>
      <h2 className="text-4xl font-black text-white capitalize tracking-tighter mb-4">
        {activeTab} Encrypted
      </h2>
      <p className="text-[#576CBC] max-w-md mx-auto font-medium text-lg leading-relaxed opacity-60">
        This area is currently being reconfigured with the latest command-link
        protocols.
      </p>
    </div>
    <button
      onClick={() => setActiveTab("dashboard")}
      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
    >
      Return to Hub
    </button>
  </div>
);
