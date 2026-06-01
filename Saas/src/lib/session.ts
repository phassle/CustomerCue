import { cookies } from 'next/headers';
import { users } from '@/data/users';
import type { SeedUser } from '@/lib/signals/types';

const COOKIE_NAME = 'cc-user';

export async function currentUser(): Promise<SeedUser> {
  const jar = await cookies();
  const userId = jar.get(COOKIE_NAME)?.value;
  return users.find((u) => u.id === userId) ?? users[0];
}

export async function setUser(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, userId, { path: '/', httpOnly: true, sameSite: 'lax' });
}
