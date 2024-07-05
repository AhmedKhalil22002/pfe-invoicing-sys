import React from 'react';
import { Container, Page404, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { QuotationMain } from '@/components/selling/quotation/QuotationMain';
import { QuotationCreateForm } from '@/components/selling/quotation/QuotationCreateForm';

const Contacts = () => {
  const router = useRouter();
  const { args } = router.query;

  const content = React.useMemo(() => {
    if (typeof args === 'object') {
      switch (args[0]) {
        case 'quotations':
          return <QuotationMain />;
        case 'new-quotation':
          return <QuotationCreateForm />;
        default:
          return <Page404 />;
      }
    }
    return <Spinner className="h-screen" />;
  }, [args]);

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">{content}</div>
    </Container>
  );
};

export default Contacts;
