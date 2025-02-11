import { auth } from '@/auth';
import Header from '@/components/Header';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import React, { ReactNode } from 'react';

const layout = async ({ children }: { children: ReactNode }) => {
  // Setup the nav bar for all required routes. Include children to pass
  // the pages contents

  // Check if session doesn't exist to redirect
  const session = await auth();
  if (!session) redirect('/sign-in');

  after(async () => {
    if (!session?.user?.id) return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user.id));
  });

  return (
    <main className='root-container'>
      <div className='mx-auto max-w-7xl'>
        <Header session={session} />
        <div className='mt-20 pb-20'>{children}</div>
      </div>
    </main>
  );
};

export default layout;
