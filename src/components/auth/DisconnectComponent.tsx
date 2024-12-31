import { api } from '@/api';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import React from 'react';

export default function DisconnectComponent() {
  const authContext = React.useContext(AuthContext);
  const router = useRouter();
  React.useEffect(() => {
    api.auth.logout();
    authContext.setAuthenticated(false);
    router.push('/authentication');
  }, []);
  return <React.Fragment></React.Fragment>;
}
