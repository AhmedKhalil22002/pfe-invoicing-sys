import useConfig from '@/hooks/content/useConfig';
import React from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_URL;

const useQuotationSocket = () => {
  const [socket, setSocket] = React.useState<any>(null);
  const [sequence, setSequence] = React.useState<any>(null);

  const {
    configs: [currentSequence],
    isPending: isQuotationSequencePending
  } = useConfig(['quotation-sequence']);

  React.useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL + '/ws', {
      transports: ['websocket']
    });

    setSocket(newSocket);

    // Set initial sequence from `currentSequence`
    if (currentSequence && currentSequence.value) {
      setSequence(currentSequence.value);
    }

    // Handle WebSocket events
    newSocket.on('quotation-sequence-updated', (data) => {
      setSequence(data.value);
    });

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [currentSequence]);

  return {
    sequence,
    isQuotationSequencePending
  };
};

export default useQuotationSocket;
