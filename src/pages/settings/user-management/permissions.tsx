import PermissionMain from '@/components/settings/UserManagement/permission/PermissionMain';
import UserManagementSettings from '@/components/settings/UserManagementSettings';
import React from 'react';

export default function Page() {
  return (
    <UserManagementSettings>
      <PermissionMain />
    </UserManagementSettings>
  );
}
