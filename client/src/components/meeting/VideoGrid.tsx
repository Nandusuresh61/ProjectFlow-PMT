import React, { useEffect, useRef } from "react";
import { MicOff, Mic, Video, VideoOff } from "lucide-react";

interface VideoTileProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  name?: string;
  isMicOn?: boolean;
  isCameraOn?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({ stream, isLocal, name, isMicOn, isCameraOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center h-48 md:h-64 lg:h-80 w-full shadow-lg border border-gray-700 transition-all duration-300">
      {stream && isCameraOn !== false ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-semibold mb-2">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="text-sm font-medium">{name || "User"}</span>
        </div>
      )}
      
      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-2 backdrop-blur-sm">
        <span>{isLocal ? "You" : name || "Participant"}</span>
        {isMicOn === false && <MicOff size={14} className="text-red-400" />}
      </div>
    </div>
  );
};

interface VideoGridProps {
  localStream: MediaStream | null;
  participants: any[]; // using array for mapping
  localMicOn: boolean;
  localCameraOn: boolean;
  userName?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  localStream,
  participants,
  localMicOn,
  localCameraOn,
  userName
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-full h-full auto-rows-max overflow-y-auto">
      <VideoTile 
        stream={localStream} 
        isLocal 
        name={userName} 
        isMicOn={localMicOn}
        isCameraOn={localCameraOn}
      />
      {participants.map((p) => (
        <VideoTile 
          key={p.socketId} 
          stream={p.stream} 
          name={p.fullName || p.userId}
          isMicOn={p.isMicOn}
          isCameraOn={p.isCameraOn}
        />
      ))}
    </div>
  );
};
