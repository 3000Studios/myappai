export default function LiveChat() {
  return (
    <div className="w-full h-96 border border-white/10 rounded-lg overflow-hidden">
      <iframe
        src="https://www.twitch.tv/embed/YOUR_CHANNEL/chat?parent=3000studios.com"
        className="w-full h-full"
        title="Live Chat"
      />
    </div>
  );
}

