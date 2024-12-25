import React from 'react';
import Permissions from '@/components/user-management/permission/Permissions';
import UserManagement from '@/components/user-management/UserManagement';

export default function Page() {
  return (
    <UserManagement className="p-10">
      <Permissions />
    </UserManagement>
  );
}
