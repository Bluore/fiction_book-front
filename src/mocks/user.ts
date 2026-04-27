export interface UserInfo {
  id: string;
  username: string;
  email: string;
  age: number;
  description: string;
  profile_image: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
  gold: number;
  vip_mark: string;
  vip_level: number;
  vip_active_at: string;
  read_books_num: number;
  read_words_num: number;
}

export const mockUser: UserInfo = {
  id: "436d6e0e-8398-4585-b64a-b681d8e1bfc3",
  username: "九灯和善",
  email: "log1539@outlook.com",
  age: 20,
  description: "笔耕不辍，字里行间见乾坤。一名热爱文字的行者。",
  profile_image: "https://picsum.photos/100/100?random=user-1",
  cover_image: "https://picsum.photos/1200/400?random=cover-1",
  created_at: "2026-04-10 14:45:34",
  updated_at: "2026-04-14 23:10:34",
  gold: 12500,
  vip_mark: "vip_2",
  vip_level: 2,
  vip_active_at: "2027-04-25 14:45:34",
  read_books_num: 42,
  read_words_num: 1250000
};
