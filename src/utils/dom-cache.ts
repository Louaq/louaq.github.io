/**
 * DOM查询缓存工具
 * 减少重复的DOM查询，提升性能
 */

type CacheEntry = {
  element: Element | null;
  timestamp: number;
};

class DOMCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL = 5000; // 缓存5秒

  /**
   * 获取缓存的元素或执行新查询
   */
  query(selector: string, forceRefresh = false): Element | null {
    const now = Date.now();
    const cached = this.cache.get(selector);

    // 如果缓存有效且不强制刷新，返回缓存
    if (!forceRefresh && cached && now - cached.timestamp < this.TTL) {
      return cached.element;
    }

    // 执行新查询
    const element = document.querySelector(selector);
    this.cache.set(selector, { element, timestamp: now });
    return element;
  }

  /**
   * 批量查询
   */
  queryAll(selector: string, forceRefresh = false): NodeListOf<Element> {
    if (forceRefresh) {
      return document.querySelectorAll(selector);
    }
    return document.querySelectorAll(selector);
  }

  /**
   * 通过ID查询（最常用的查询）
   */
  byId(id: string, forceRefresh = false): HTMLElement | null {
    const selector = `#${id}`;
    return this.query(selector, forceRefresh) as HTMLElement | null;
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清除特定选择器的缓存
   */
  invalidate(selector: string): void {
    this.cache.delete(selector);
  }

  /**
   * 清除过期缓存
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [selector, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.TTL) {
        this.cache.delete(selector);
      }
    }
  }
}

// 导出单例
export const domCache = new DOMCache();

// 在页面导航时清除缓存
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    domCache.clear();
  });

  document.addEventListener('swup:content:replace', () => {
    domCache.clear();
  });
}
