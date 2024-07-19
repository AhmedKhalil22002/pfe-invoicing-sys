import React, { useState, useEffect } from 'react';
import { Container, Page404, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { ComingSoon } from '@/components/common/ComingSoon';

const Settings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [args, setArgs] = useState<string[]>([]);

  useEffect(() => {
    const query = router.query.arg;
    if (query) {
      setArgs(typeof query === 'string' ? [query] : query);
      setLoading(false);
    }
  }, [router.query]);

  const [arg1, arg2] = args;

  const content = React.useMemo(() => {
    if (loading) return <Spinner className="h-screen" />;

    if (arg1 === 'Information') {
      return <InformationalSettings defaultValue={arg2 || 'profile'} />;
    }
    if (arg1 === 'system') {
      return <SystemSettings defaultValue={arg2 || 'activity'} />;
    }
    if (arg1 === 'general') {
      return <ComingSoon />;
    }

    return <Page404 />;
  }, [arg1, arg2, loading]);

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">{content}</div>
    </Container>
  );
};

export default Settings;
