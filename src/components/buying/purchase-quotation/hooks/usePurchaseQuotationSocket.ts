import React from 'react';

import useSocket from '@/hooks/useSocket';
import { toast } from 'sonner';
import { SocketRoom } from '@/types/enums/socket-room';
import { ResponseSequenceDto, Sequences } from '@/types';
import { useSequence } from '@/hooks/content/useSequence';

const usePurchaseQuotationSocket = () => {
    const { sequence, isSequencePending, refetchSequence } = useSequence({
    label: Sequences.PURCHASE_QUOTATION
  });

  const [currentSequence, setCurrentSequence] = React.useState<Partial<ResponseSequenceDto> | null>(
    null
  );
  const hasJoinedRef = React.useRef(false);

  const socket = useSocket('/ws');

  React.useEffect(() => {
     if (sequence) {
      setCurrentSequence(sequence);
    }
  }, [sequence]);

  React.useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (!hasJoinedRef.current) {
        socket.emit('joinRoom', SocketRoom.PURCHASE_QUOTATION);
        hasJoinedRef.current = true;
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on('connect', handleConnect);
    }

    socket.on('purchaseQuotation-sequence-updated', (data) => {
      setCurrentSequence((prevSequence) =>
        prevSequence ? { ...prevSequence, next: data.value } : { next: data.value }
      );
      toast.info('Le numéro séquentiel a été mis à jour');
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
        socket.emit('leaveRoom', SocketRoom.PURCHASE_QUOTATION);
        console.log('Left room: PURCHASE_QUOTATION_SEQUENCE');
        hasJoinedRef.current = false;
      }

      socket.off('connect', handleConnect);
      socket.off('purchaseQuotation-sequence-updated');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [socket]);

  return {
    currentSequence,
    refetchSequence,
    isPurchaseQuotationSequencePending: isSequencePending, // ✅ ajouter cette ligne
  };
};

export default usePurchaseQuotationSocket;
