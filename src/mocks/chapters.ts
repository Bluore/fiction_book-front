export interface BookChapter {
  chapter_id: string;
  title: string;
  content?: string;
  order: number;
  vip_level: string;
  price: number;
}

export const mockChapters: Record<string, { Chapters: BookChapter[] }> = {
  "book-1": {
    Chapters: Array.from({ length: 50 }, (_, i) => ({
      chapter_id: `chapter-1-${i + 1}`,
      title: `第一集 第${i + 1}章：${['初入仙途', '神秘剑诀', '宗门测试', '后山奇遇', '同门切磋'][i % 5]}`,
      content: `这是第 ${i + 1} 章的内容示例。\n\n林小溪忙里忙外，小橘则懒洋洋地趴在窗台上晒太阳，偶尔睁开眼看看店里的客人，发出一两声满足的"咕噜"声。\n\n下午时分，一个头发花白的老人走进了咖啡馆。\n\n他看起来七十多岁，身形消瘦，穿着一件洗得发白的灰色外套。但仔细看去，老人虽然年迈，眼神却依旧清明，举手投足间透着一股不凡的气质。\n\n"老板，来一杯美式咖啡。"老人在一个靠窗的位置坐下。\n\n"好的，您稍等。"林小溪应道。`,
      order: i + 1,
      vip_level: i > 10 ? "vip_1" : "free",
      price: i > 10 ? 10 : 0,
    }))
  }
};
