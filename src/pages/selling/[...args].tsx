import React from 'react';
import { Container, Page404 } from '@/components/common';
import { useRouter } from 'next/router';

const Selling = () => {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Page404 />
      </div>
    </Container>
  );
};

export default Selling;
