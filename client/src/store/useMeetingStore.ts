import { create } from "zustand";

interface Participant {
  userId: string;
  socketId: string;
  stream: MediaStream | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  fullName?: string;
}

interface MeetingState {
  localStream: MediaStream | null;
  participants: Record<string, Participant>;
  isMicOn: boolean;
  isCameraOn: boolean;
  setLocalStream: (stream: MediaStream | null) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  addParticipant: (socketId: string, userId: string, fullName?: string) => void;
  removeParticipant: (socketId: string) => void;
  updateParticipantStream: (socketId: string, stream: MediaStream) => void;
  updateParticipantState: (userId: string, state: Partial<Participant>) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  localStream: null,
  participants: {},
  isMicOn: true,
  isCameraOn: true,
  
  setLocalStream: (stream) => set({ localStream: stream }),
  
  toggleMic: () => {
    const { localStream, isMicOn } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    set({ isMicOn: !isMicOn });
  },
  
  toggleCamera: () => {
    const { localStream, isCameraOn } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
    }
    set({ isCameraOn: !isCameraOn });
  },

  addParticipant: (socketId, userId, fullName) => {
    set((state) => ({
      participants: {
        ...state.participants,
        [socketId]: {
          userId,
          socketId,
          stream: null,
          isMicOn: true,
          isCameraOn: true,
          fullName,
        },
      },
    }));
  },

  removeParticipant: (socketId) => {
    set((state) => {
      const newParticipants = { ...state.participants };
      delete newParticipants[socketId];
      return { participants: newParticipants };
    });
  },

  updateParticipantStream: (socketId, stream) => {
    set((state) => ({
      participants: {
        ...state.participants,
        [socketId]: {
          ...state.participants[socketId],
          stream,
        },
      },
    }));
  },

  updateParticipantState: (userId, newState) => {
    set((state) => {
      const newParticipants = { ...state.participants };
      const socketId = Object.keys(newParticipants).find(
        (id) => newParticipants[id].userId === userId
      );
      if (socketId) {
        newParticipants[socketId] = {
          ...newParticipants[socketId],
          ...newState,
        };
      }
      return { participants: newParticipants };
    });
  },

  reset: () => set({
    localStream: null,
    participants: {},
    isMicOn: true,
    isCameraOn: true,
  }),
}));
