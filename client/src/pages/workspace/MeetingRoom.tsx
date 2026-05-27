import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useMeetingStore } from "@/store/useMeetingStore";
import { VideoGrid } from "@/components/meeting/VideoGrid";
import { Controls } from "@/components/meeting/Controls";
import { getMeeting, endMeeting } from "@/services/meetingService";
import { AuthUserState } from "@/store/auth.store";
import type { Meeting } from "@/types/meeting.types";
import { Loader2 } from "lucide-react";

export const MeetingRoom: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user } = AuthUserState();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    localStream,
    participants,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
  } = useMeetingStore();

  // Initialize WebRTC and Socket
  useWebRTC(meetingId || "", !!meeting && !error, () => {
    setError("This meeting has been ended by the host.");
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!meetingId) return;
      try {
        const data = await getMeeting(meetingId);
        setMeeting(data);
        if (data.status === "ENDED") {
          setError("This meeting has already ended.");
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to load meeting");
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [meetingId]);

  const handleLeave = () => {
    navigate(-1);
  };

  const handleEndMeeting = async () => {
    if (!meetingId) return;
    try {
      await endMeeting(meetingId);
      navigate(-1);
    } catch (err) {
      console.error("Failed to end meeting", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
        <Loader2 className="animate-spin mr-2" size={32} />
        <span className="text-xl font-semibold">Joining Meeting...</span>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-950 text-white p-6">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Cannot Join</h2>
          <p className="text-gray-400 mb-8">{error || "Meeting not found"}</p>
          <button
            onClick={handleLeave}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isHost = user?.userId === meeting.hostId;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{meeting.title}</h1>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Meeting in progress
          </p>
        </div>
        <div className="text-sm font-medium bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 shadow-inner">
          {Object.keys(participants).length + 1} {Object.keys(participants).length + 1 === 1 ? 'Participant' : 'Participants'}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 overflow-hidden relative">
        <VideoGrid
          localStream={localStream}
          participants={Object.values(participants)}
          localMicOn={isMicOn}
          localCameraOn={isCameraOn}
          userName={user?.fullName || ""}
        />
      </div>

      {/* Controls */}
      <Controls
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onLeave={handleLeave}
        isHost={isHost}
        onEndMeeting={handleEndMeeting}
      />
    </div>
  );
};
