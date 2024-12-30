import Permissions from '@/components/settings/UserManagement/permission/Permissions';
import UserManagementSettings from '@/components/settings/UserManagementSettings';
import React from 'react';

export default function Page() {
  return (
    <UserManagementSettings>
      <Permissions />
    </UserManagementSettings>
  );
}
