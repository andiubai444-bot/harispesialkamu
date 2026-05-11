export default function Loading() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #2a0008 0%, #3e000c 60%, #1a0004 100%)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        fontSize: 48,
        animation: "pulse 1.2s ease-in-out infinite",
      }}>
        ❤️
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
