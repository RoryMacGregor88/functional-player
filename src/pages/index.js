import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

export default function Landing({ user }) {
  const router = useRouter();

  if (!!user) {
    router.push('/dashboard');
    return <LoadMask />;
  }

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ textAlign: 'center' }}>HOME PAGE</h1>
      {!!user ? (
        <h1 style={{ textAlign: 'center' }}>
          You are logged in as: {user.username}
        </h1>
      ) : (
        <h1 style={{ textAlign: 'center' }}>You are not logged in.</h1>
      )}
    </div>
  );
}
