export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '18px 18px 18px 4px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#6c47ff',
              animation: `bounce 1.2s infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}