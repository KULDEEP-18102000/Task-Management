import React, { useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { isConnected } = useWebSocket();

  useEffect(() => {
    console.log('WebSocket connection status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  return <AppRoutes />;
}

export default App;
