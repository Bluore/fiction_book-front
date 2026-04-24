export interface BookMetadata {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  owner_id: string;
  vip_level: string;
  price: number;
  push_at: string;
  browse_amount: number;
  bookshelf_amount: number;
  created_at: string;
  updated_at: string;
}

export const mockBooks: BookMetadata[] = Array.from({ length: 27 }, (_, i) => ({
  id: `book-${i + 1}`,
  name: i === 0 ? "苍穹剑仙传" : `修仙传第 ${i + 1} 卷`,
  description: i === 0
    ? "一个平凡少年偶得神秘剑诀，踏上修仙之路，历经磨难终成一代剑仙。"
    : `这是关于修仙的第 ${i + 1} 个故事，充满了奇遇和挑战。`,
  cover_image: `https://picsum.photos/368/460?random=${i + 1}`,
  owner_id: "owner-123",
  vip_level: `vip_${(i % 3) + 1}`,
  price: 299 + i * 10,
  push_at: "2026-04-20T21:49:17+08:00",
  browse_amount: Math.floor(Math.random() * 10000),
  bookshelf_amount: Math.floor(Math.random() * 1000),
  created_at: "2026-04-20T21:49:17.135+08:00",
  updated_at: "2026-04-20T21:49:17.135+08:00",
}));
