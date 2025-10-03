type UpdateProfileArg = {
  arg: {
    token: string | null | undefined;
    fullName: string;
    email: string;
  };
};

export async function updateProfile(
  url: RequestInfo | URL,
  { arg }: UpdateProfileArg
) {
  const token = arg.token;
  const fullName = arg.fullName;
  const email = arg.email;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name: fullName, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to update profile'
    );
  }

  return data;
}

type UpdatePasswordArg = {
  arg: {
    token: string | null | undefined;
    currentPassword: string;
    newPassword: string;
  };
};

export async function updatePassword(
  url: RequestInfo | URL,
  { arg }: UpdatePasswordArg
) {
  const currentPassword = arg.currentPassword;
  const newPassword = arg.newPassword;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to update password'
    );
  }

  return data;
}
