export type Url = {
  id: number;
  short_url: string;
  long_url: string;
  created_at: string;
  expires_at: string;
};

export type GetUrl = {
  data: Url[];
  count: number;
};
