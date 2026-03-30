import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown, Check, Plus, Building } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspace.store';

interface WorkspaceSwitcherProps {
    onOpenCreate: () => void;
    isCollapsed?: boolean;
}

export const WorkspaceSwitcher = ({ onOpenCreate, isCollapsed = false }: WorkspaceSwitcherProps) => {
    const { workspaces, currentWorkspace, switchActiveWorkspace, isLoading } = useWorkspaceStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = async (workspaceId: string) => {
        if (workspaceId === currentWorkspace?.workspaceId) return;
        setIsOpen(false);
        await switchActiveWorkspace(workspaceId);
    };

    if (isCollapsed) return null; // Handle collapsed state outside if needed or render simple icon

    return (
        <div className="relative min-w-[160px] max-w-[240px]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
            >
                <div className="w-6 h-6 rounded bg-[#19376D] text-[#A5D7E8] group-hover:bg-[#A5D7E8] group-hover:text-[#0B2447] transition-all flex items-center justify-center flex-shrink-0">
                    <Building size={12} />
                </div>
                <span className="text-sm font-semibold text-white/90 truncate flex-1 text-left">
                   {isLoading ? "Loading..." : (currentWorkspace?.name || "Select Workspace")}
                </span>
                <ChevronsUpDown size={14} className="text-[#576CBC]/60 group-hover:text-white transition-colors flex-shrink-0 ml-1" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0B2447] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                           <div className="px-2 py-1">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-[#576CBC]/70">Your Workspaces</span>
                           </div>
                           
                           {workspaces.map((ws) => (
                               <button
                                   key={ws.workspaceId}
                                   onClick={() => handleSwitch(ws.workspaceId)}
                                   className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
                                       ws.workspaceId === currentWorkspace?.workspaceId
                                           ? 'bg-[#A5D7E8]/10 text-[#A5D7E8]'
                                           : 'text-white/80 hover:bg-white/5 hover:text-white'
                                   }`}
                               >
                                  <div className="flex items-center gap-2 truncate">
                                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                          ws.workspaceId === currentWorkspace?.workspaceId 
                                            ? 'bg-[#A5D7E8]/20 text-[#A5D7E8]' 
                                            : 'bg-white/10 text-white/70'
                                      }`}>
                                          {ws.name.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="truncate">{ws.name}</span>
                                  </div>
                                  {ws.workspaceId === currentWorkspace?.workspaceId && (
                                      <Check size={16} className="text-[#A5D7E8]" />
                                  )}
                               </button>
                           ))}
                           
                           {workspaces.length === 0 && (
                               <>
                                   <div className="h-px bg-white/10 my-1 mx-2"></div>
                                   
                                   <button
                                       onClick={() => {
                                           setIsOpen(false);
                                           onOpenCreate();
                                       }}
                                       className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-[#A5D7E8] hover:bg-[#A5D7E8]/10 transition-colors font-medium"
                                   >
                                       <div className="w-6 h-6 rounded bg-[#A5D7E8]/20 flex items-center justify-center">
                                           <Plus size={14} />
                                       </div>
                                       Create Workspace
                                   </button>
                               </>
                           )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
