import { useEffect, useRef } from "react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useSocket } from "@/app/Providers/SocketProvider";
import { Socket } from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const useWebRTC = (meetingId: string, shouldConnect: boolean = true) => {
  const {
    localStream,
    setLocalStream,
    addParticipant,
    removeParticipant,
    updateParticipantStream,
    updateParticipantState,
    isMicOn,
    isCameraOn,
  } = useMeetingStore();

  // We need the socket instance
  // Note: Adjust how socket is retrieved based on actual implementation.
  // Using a mock approach where useSocket provides the current socket.
  const { socket } = useSocket() as { socket: Socket | null }; 

  const peersRef = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    if (!socket || !shouldConnect) return;

    const initWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        // Join room via socket
        socket.emit("join-meeting", meetingId);

        // Notify initial states
        socket.emit("toggle-mic", { meetingId, isMicOn });
        socket.emit("toggle-camera", { meetingId, isCameraOn });

      } catch (err) {
        console.error("Error accessing media devices", err);
      }
    };

    initWebRTC();

    return () => {
      // Cleanup
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      if (socket) {
        socket.emit("leave-meeting", meetingId);
      }
      Object.values(peersRef.current).forEach((pc) => pc.close());
    };
  }, [meetingId, shouldConnect]); // eslint-disable-line

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeerConnection = (targetSocketId: string, userId: string, fullName?: string) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      
      peersRef.current[targetSocketId] = pc;
      addParticipant(targetSocketId, userId, fullName);

      // Add local tracks to PC
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetSocketId,
            meetingId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          updateParticipantStream(targetSocketId, event.streams[0]);
        }
      };

      return pc;
    };

    socket.on("user-joined", async ({ userId, socketId, fullName }) => {
      const pc = createPeerConnection(socketId, userId, fullName);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc-offer", { targetSocketId: socketId, meetingId, offer });
    });

    socket.on("receive-offer", async ({ senderSocketId, userId, fullName, offer }) => {
      const pc = createPeerConnection(senderSocketId, userId, fullName);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", { targetSocketId: senderSocketId, meetingId, answer });
    });

    socket.on("receive-answer", async ({ senderSocketId, answer }) => {
      const pc = peersRef.current[senderSocketId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("receive-ice-candidate", async ({ senderSocketId, candidate }) => {
      const pc = peersRef.current[senderSocketId];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("user-left", ({ socketId }) => {
      removeParticipant(socketId);
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
    });

    socket.on("participant-updated", ({ userId, isMicOn, isCameraOn }) => {
      updateParticipantState(userId, {
        ...(isMicOn !== undefined && { isMicOn }),
        ...(isCameraOn !== undefined && { isCameraOn }),
      });
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
      socket.off("user-left");
      socket.off("participant-updated");
    };
  }, [socket, localStream, meetingId]); // eslint-disable-line

  // Sync mic/camera changes with others
  useEffect(() => {
    if (socket) {
      socket.emit("toggle-mic", { meetingId, isMicOn });
    }
  }, [isMicOn, meetingId, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("toggle-camera", { meetingId, isCameraOn });
    }
  }, [isCameraOn, meetingId, socket]);

};
