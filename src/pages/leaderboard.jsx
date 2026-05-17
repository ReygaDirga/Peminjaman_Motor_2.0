export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#1f2229] text-white overflow-hidden relative flex items-center justify-center px-6">
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          <span className="text-white">COMING</span>{" "}
          <span className="text-cyan-300">SOON</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          We’re building something better for this website.
          New features and a more modern experience are on
          the way.
        </p>
      </div>
    </div>
  );
}
