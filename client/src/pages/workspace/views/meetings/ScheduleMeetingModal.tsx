import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getMembers } from '@/services/workspace/team.api';
import { createMeeting } from '@/services/meetingService';
import { useWorkspaceStore } from '@/store/workspace.store';
import { AuthUserState } from '@/store/auth.store';
import { toast } from 'sonner';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface Member {
  userId: string;
  fullName: string;
  email: string;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = AuthUserState();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen && currentWorkspace?.workspaceId) {
      fetchMembers();
      // Reset form
      setTitle('');
      setDate('');
      setTime('');
      setDuration('30');
      setSelectedParticipants([]);
    }
  }, [isOpen, currentWorkspace]);

  const fetchMembers = async () => {
    if (!currentWorkspace) return;
    setLoadingMembers(true);
    try {
      const response = await getMembers(currentWorkspace.workspaceId);
      // Assuming response.data is the array of members
      setMembers(response.data || []);
    } catch (error) {
      toast.error('Failed to load workspace members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleToggleParticipant = (userId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!currentWorkspace?.workspaceId) return;

    // Combine date and time into a single Date object
    const scheduledAt = new Date(`${date}T${time}`);

    setIsCreating(true);
    try {
      await createMeeting({
        workspaceId: currentWorkspace.workspaceId,
        title,
        scheduledAt,
        duration: parseInt(duration),
        participants: selectedParticipants
      });
      toast.success('Meeting scheduled successfully');
      onCreated();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Schedule Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meeting Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Weekly Sync"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes) *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Participants</label>
            <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-2 max-h-40 overflow-y-auto">
              {loadingMembers ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-indigo-500" size={20} />
                </div>
              ) : members.filter(m => m.userId !== user?.userId).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-2">No other members available.</p>
              ) : (
                members.filter(m => m.userId !== user?.userId).map((member) => (
                  <label key={member.userId} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(member.userId)}
                      onChange={() => handleToggleParticipant(member.userId)}
                      className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-800"
                    />
                    <span className="text-sm text-gray-200">
                      {member.fullName} ({member.email})
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isCreating && <Loader2 className="animate-spin" size={16} />}
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
