import React from 'react';
import UserManagementSettings from '@/components/settings/UserManagementSettings';
import UserMain from '@/components/settings/UserManagement/user/UserMain';

export default function Page() {
  return (
    <UserManagementSettings>
      <UserMain />
    </UserManagementSettings>
  );
}
