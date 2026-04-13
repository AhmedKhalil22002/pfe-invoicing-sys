import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuthPersistStore } from '@/hooks/stores/useAuthPersistStore';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

export function AuthTokenSync() {
  const { data: rawSession, status } = useSession();
  const authPersistStore = useAuthPersistStore();
  const session = rawSession as Session;

  React.useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user?.access_token && session?.user?.refresh_token) {
      // Valid session — sync tokens to store
      authPersistStore.setAccessToken(session.user.access_token);
      authPersistStore.setRefreshToken(session.user.refresh_token);
      authPersistStore.setAuthenticated(true);
    } else if (status === 'unauthenticated') {
      // No valid NextAuth session — always clear localStorage
      // This fixes the bug where stale localStorage allows access without real login
      if (authPersistStore.accessToken || authPersistStore.isAuthenticated) {
        authPersistStore.logout();
      }
    }
  }, [session, status]);

  return null;
}