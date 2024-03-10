import React from 'react';
import UserTable from '@/components/UserTable';
import withAuth from '@/components/withAuth';

function Users() {
  return (
    <UserTable/>
  );
}

export default withAuth(Users, ['admin']);