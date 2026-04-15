export default function Status() {
  return (
    <pre style={{ color: '#0f0', background: '#000', padding: 20 }}>
      ANTIGRAVITY: CLOUD MODE
      {'\n'}Status: ONLINE
      {'\n'}Last Check: {new Date().toISOString()}
    </pre>
  );
}

