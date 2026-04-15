/**
 * WebRTC Service
 * Handles live streaming with WebRTC and TURN server
 */

export interface WebRTCConfig {
  iceServers: Array<{
    urls: string | string[];
    username?: string;
    credential?: string;
  }>;
}

export function getWebRTCConfig(): WebRTCConfig {
  const WEBRTC_TURN_URL = process.env.WEBRTC_TURN_URL;
  const WEBRTC_TURN_USER = process.env.WEBRTC_TURN_USER;
  const WEBRTC_TURN_PASS = process.env.WEBRTC_TURN_PASS;

  return {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302', // Public STUN server
      },
      {
        urls: WEBRTC_TURN_URL || 'turn:turn.example.com:3478',
        username: WEBRTC_TURN_USER,
        credential: WEBRTC_TURN_PASS,
      },
    ],
  };
}

export interface StreamConfig {
  streamId: string;
  streamKey: string;
  title: string;
  description?: string;
}

export class WebRTCBroadcaster {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private config: WebRTCConfig;

  constructor() {
    this.config = getWebRTCConfig();
  }

  async startBroadcast(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      // Get user media (camera/microphone)
      this.localStream = await navigator.mediaDevices.getUserMedia(
        constraints || {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }
      );

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.config);

      // Add local stream tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      return this.localStream;
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to start broadcast');
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveVideo: false,
        offerToReceiveAudio: false,
      });

      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to create offer');
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to handle answer');
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to add ICE candidate');
    }
  }

  stopBroadcast(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate | null) => void): void {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = (event) => {
        callback(event.candidate);
      };
    }
  }

  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void): void {
    if (this.peerConnection) {
      this.peerConnection.onconnectionstatechange = () => {
        callback(this.peerConnection!.connectionState);
      };
    }
  }
}

export class WebRTCViewer {
  private peerConnection: RTCPeerConnection | null = null;
  private remoteStream: MediaStream | null = null;
  private config: WebRTCConfig;

  constructor() {
    this.config = getWebRTCConfig();
  }

  async connect(): Promise<void> {
    try {
      this.peerConnection = new RTCPeerConnection(this.config);
      this.remoteStream = new MediaStream();

      this.peerConnection.ontrack = (event) => {
        event.streams?.[0]?.getTracks()?.forEach((track) => {
          this.remoteStream?.addTrack(track);
        });
      };
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to connect viewer');
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error: unknown) {
      console.error("", error);
      throw new Error('Failed to handle offer');
    }
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  disconnect(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate | null) => void): void {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = (event) => {
        callback(event.candidate);
      };
    }
  }
}

