import { redirect } from 'next/navigation';
import { setUser } from '@/lib/session';
import { users } from '@/data/users';

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    await setUser(userId);
    redirect('/');
  }

  return (
    <div className="flex h-full items-center justify-center" style={{ background: 'var(--color-paper)' }}>
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md"
            style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
          >
            <span className="serif text-xl font-semibold">CC</span>
          </div>
          <h1 className="serif text-3xl font-normal" style={{ color: 'var(--color-ink)', letterSpacing: '-0.028em' }}>
            CustomerCue
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-ink-mute)' }}>
            Select a user to continue
          </p>
        </div>
        <div className="space-y-3">
          {users.map((user) => (
            <form key={user.id} action={login}>
              <input type="hidden" name="userId" value={user.id} />
              <button
                type="submit"
                className="w-full rounded-md border p-4 text-left transition-colors hover:bg-white"
                style={{ borderColor: 'var(--color-rule-strong)', background: 'var(--color-surface)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '0.06em' }}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--color-ink)' }}>{user.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-ink-mute)' }}>{user.role}</div>
                  </div>
                </div>
              </button>
            </form>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Demo build &middot; fictional data
        </p>
      </div>
    </div>
  );
}
