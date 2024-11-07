import useConfig from '@/hooks/content/useConfig';
import React from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const SOCKET_URL =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_URL;

const useInvoiceSocket = () => {
  const [socket, setSocket] = React.useState<any>(null);
  const [sequence, setSequence] = React.useState<any>(null);

  const {
    configs: [currentSequence],
    isConfigPending: isInvoiceSequencePending
  } = useConfig(['invoice_sequence']);

  React.useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL || '', {
      path: '/ws'
    });

    setSocket(newSocket);

    if (currentSequence && currentSequence.value) {
      setSequence(currentSequence.value);
    }

    newSocket.on('connect', () => {
      console.log('Connected to invoice socket');
    });

    newSocket.on('invoice-sequence-updated', (data) => {
      setSequence(data.value);
      toast.info('Le numéro séquentiel a été mis à jour');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Erreur de connexion au serveur');
    });

    newSocket.on('', (data) => {
      setSequence(data.value);
    });

    //disconnect from socket when the component is unmounted
    return () => {
      newSocket.disconnect();
      console.log('Disconnected from invoice socket');
    };
  }, [currentSequence]);

  return {
    sequence,
    isInvoiceSequencePending
  };
};

export default useInvoiceSocket;
