import Roles from '@/components/settings/UserManagement/role/Roles';
import UserManagementSettings from '@/components/settings/UserManagementSettings';
import React from 'react';

export default function Page() {
  return (
    <UserManagementSettings>
      <Roles />
    </UserManagementSettings>
  );
}
