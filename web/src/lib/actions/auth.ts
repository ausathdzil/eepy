export async function login(
  url: RequestInfo | URL,
  { arg }: { arg: FormData }
) {
  const email = arg.get('email') as string;
  const password = arg.get('password') as string;

  const searchParams = new URLSearchParams({
    username: email,
    password,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParams.toString(),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Failed to login');
  }

  return data;
}
