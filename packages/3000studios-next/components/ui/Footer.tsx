export const Footer = () => (
  <footer className="relative mt-12 overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 -z-10">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity: 0.6 }}
      >
        <source
          src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766972500/3000_studios_back_dop_nldai9.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/70"></div>
    </div>

    {/* Footer Content */}
    <div className="relative px-6 py-12 text-white text-center">
      <p>&copy; 2025 3000 Studios. All rights reserved.</p>
    </div>
  </footer>
);

