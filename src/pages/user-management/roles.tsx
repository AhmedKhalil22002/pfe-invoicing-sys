import React from 'react';
import UserManagement from '@/components/user-management/UserManagement';
import Roles from '@/components/user-management/role/Roles';

export default function Page() {
  return (
    <UserManagement>
      <Roles />
    </UserManagement>
  );
}
