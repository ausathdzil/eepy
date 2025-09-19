export type User = {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Users = {
  data: User[];
  count: number;
};
