import VoiceEditor from "@/components/matrix/VoiceEditor";
import LivePreview from "@/components/matrix/LivePreview";
import AnalyticsPanel from "@/components/matrix/AnalyticsPanel";
import StreamController from "@/components/matrix/StreamController";
import StoreManager from "@/components/matrix/StoreManager";
import AvatarControl from "@/components/matrix/AvatarControl";
import SoundControl from "@/components/matrix/SoundControl";
import SystemHealth from "@/components/matrix/SystemHealth";
import QuickActions from "@/components/matrix/QuickActions";
import MatrixLog from "@/components/matrix/MatrixLog";
import VisitorMap from "@/components/matrix/VisitorMap";
import InstinctLog from "@/components/matrix/InstinctLog";
import LiveVisitors from "@/components/matrix/LiveVisitors";
import EditorOutput from "@/components/matrix/EditorOutput";
import VoiceCapture from "@/components/creator/VoiceCapture";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MatrixPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("matrix-session");

  if (session?.value !== "active") {
    redirect("/login");
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-10 pb-32 overflow-x-hidden">
      <VoiceCapture />
      <h1 className="text-6xl font-black text-center mb-16 bg-gradient-to-r from-gold to-sapphire bg-clip-text text-transparent drop-shadow-lg">
        THE MATRIX CONTROL ROOM
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

        {/* COLUMN 1 */}
        <div className="space-y-12">
          <VoiceEditor />
          <QuickActions />
          <SoundControl />
          <InstinctLog />
        </div>

        {/* COLUMN 2 */}
        <div className="space-y-12">
          <LivePreview />
          <AvatarControl />
          <SystemHealth />
          <VisitorMap />
          <LiveVisitors />
        </div>

        {/* COLUMN 3 */}
        <div className="space-y-12">
          <AnalyticsPanel />
          <StoreManager />
          <StreamController />
          <EditorOutput />
        </div>
      </div>

      <div className="mt-16">
        <MatrixLog />
      </div>
    </div>
  );
}

