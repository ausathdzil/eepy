import type { User } from './user.ts';

export type Url = {
  id: number;
  short_url: string;
  long_url: string;
  created_at: string;
  expires_at: string;
  user: User;
};

export type Urls = {
  data: Url[];
  count: number;
};
