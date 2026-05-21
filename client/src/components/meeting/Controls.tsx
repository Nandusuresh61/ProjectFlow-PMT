import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface ControlsProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
  isHost?: boolean;
  onEndMeeting?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onLeave,
  isHost,
  onEndMeeting
}) => {
  return (
    <div className="flex items-center justify-center gap-4 py-4 bg-gray-900 border-t border-gray-800">
      <button
        onClick={onToggleMic}
        className={`p-4 rounded-full flex items-center justify-center transition-colors shadow-sm ${
          isMicOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
      >
        {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
      </button>

      <button
        onClick={onToggleCamera}
        className={`p-4 rounded-full flex items-center justify-center transition-colors shadow-sm ${
          isCameraOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={isCameraOn ? "Turn off Camera" : "Turn on Camera"}
      >
        {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
      </button>

      <button
        onClick={onLeave}
        className="p-4 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
        title="Leave Meeting"
      >
        <PhoneOff size={24} />
      </button>

      {isHost && onEndMeeting && (
        <button
          onClick={onEndMeeting}
          className="px-6 py-3 ml-4 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium shadow-sm transition-colors border border-red-600"
        >
          End Meeting
        </button>
      )}
    </div>
  );
};
