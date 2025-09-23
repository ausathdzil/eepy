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
    throw new Error(data.detail[0].msg || data.detail || 'Failed to login');
  }

  return data;
}

export async function register(
  url: RequestInfo | URL,
  { arg }: { arg: FormData }
) {
  const fullName = arg.get('full_name') as string;
  const email = arg.get('email') as string;
  const password = arg.get('password') as string;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name: fullName, email, password }),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail[0].msg || data.detail || 'Failed to register');
  }

  return data;
}

export async function logout(url: RequestInfo | URL) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Failed to logout');
  }

  return data;
}
