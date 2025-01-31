import React from 'react';
import useSocket from '@/hooks/useSocket';
import { toast } from 'react-toastify';
import { SocketRoom } from '@/types/enums/socket-room';
import { Log } from '@/types';

const useSocketLogs = () => {
  const [logs, setLogs] = React.useState<Log[]>([]);
  const hasJoinedRef = React.useRef(false);

  const socket = useSocket('/ws');

  React.useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (!hasJoinedRef.current) {
        socket.emit('joinRoom', SocketRoom.LOGGER);
        console.log('Joined room: LOGGER');
        hasJoinedRef.current = true;
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on('connect', handleConnect);
    }

    socket.on('new-log', (data) => {
      setLogs((prevLogs) => {
        return [data, ...prevLogs];
      });
      toast.info('New Log Appeared');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Erreur de connexion au serveur');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server');
      hasJoinedRef.current = false;
    });

    return () => {
      if (socket && hasJoinedRef.current) {
        socket.emit('leaveRoom', SocketRoom.INVOICE_SEQUENCE);
        console.log('Left room: LOGGER');
        hasJoinedRef.current = false;
      }

      socket.off('connect', handleConnect);
      socket.off('invoice-sequence-updated');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [socket]);

  return {
    logs
  };
};

export default useSocketLogs;
