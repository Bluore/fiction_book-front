export interface BookChapter {
  chapter_id: string;
  title: string;
  order: number;
  vip_level: string;
  price: number;
}

export const mockChapters: Record<string, { Chapters: BookChapter[] }> = {
  "book-1": {
    Chapters: Array.from({ length: 50 }, (_, i) => ({
      chapter_id: `chapter-1-${i + 1}`,
      title: `第一集 第${i + 1}章：${['初入仙途', '神秘剑诀', '宗门测试', '后山奇遇', '同门切磋'][i % 5]}`,
      order: i + 1,
      vip_level: i > 10 ? "vip_1" : "free",
      price: i > 10 ? 10 : 0,
    }))
  }
};
