/**
 * 封面图兜底 / 懒加载逻辑（原本内联在 RandomCoverImage.astro 的 <script> 里）。
 *
 * 搬出来的原因：该组件只在列表页渲染，它的 <script> 也就只出现在列表页。swup 导航
 * 不会执行新页面的脚本，所以「先落地文章页 → 再点首页」这条路径下这段逻辑永远不会跑。
 * 由 Layout 的常驻脚本 import 并调用，才能保证任何入口都生效。
 * 内部基于 document 查询 + MutationObserver，是文档级单例，只需执行一次。
 */
let started = false;

export function initCoverImages(): void {
	if (started) return;
	started = true;
    function isPageRefresh() {
      try {
        if (window.performance && window.performance.getEntriesByType) {
          const navEntries = window.performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            const navType = navEntries[0].type;
            if (navType === 'reload' || navType === 'navigate') {
              return true;
            }
            if (navType === 'back_forward') {
              return false;
            }
          }
        }
        const perf = /** @type {any} */ (window.performance);
        if (perf && perf.navigation) {
          const navType = perf.navigation.type;
          if (navType === perf.navigation.TYPE_RELOAD) {
            return true;
          }
          if (navType === 2) {
            return false;
          }
        }
        const refreshCheckKey = 'random_cover_image_last_init_time';
        const navigationCheckKey = 'random_cover_image_navigation_type';
        const now = Date.now();
        const lastInitTime = sessionStorage.getItem(refreshCheckKey);
        const lastNavType = sessionStorage.getItem(navigationCheckKey);
        
        if (!lastInitTime || (now - parseInt(lastInitTime)) > 10000) {
          sessionStorage.setItem(refreshCheckKey, now.toString());
          sessionStorage.setItem(navigationCheckKey, 'refresh');
          return true;
        }
        
        if (lastNavType === 'back_forward' && (now - parseInt(lastInitTime)) < 5000) {
          return false;
        }
        
        sessionStorage.setItem(refreshCheckKey, now.toString());
        sessionStorage.setItem(navigationCheckKey, 'refresh');
        return true;
      } catch (e) {
        return true;
      }
    }
    
    function clearApiFailureCache() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('api_image_failed_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(function(key) {
          localStorage.removeItem(key);
        });
      } catch (e) {
        // 静默处理缓存清理错误
      }
    }
    
    function checkAndUseFallbackForFailedApis() {
      const allApiImages = document.querySelectorAll('img[data-seed][data-fallback][data-enable="true"]');
      
      allApiImages.forEach(function(img) {
        const seed = img.dataset.seed;
        const fallbackUrl = img.dataset.fallback;
        
        if (seed && fallbackUrl) {
          try {
            const failureKey = 'api_image_failed_' + seed;
            if (localStorage.getItem(failureKey) === 'true') {
              if (img.src !== fallbackUrl && !img.src.includes(fallbackUrl.split('?')[0])) {
                img.src = fallbackUrl;
              }
              const container = img.parentElement;
              if (container) {
                const watermarkEl = container.querySelector('[data-watermark]');
                if (watermarkEl) {
                  watermarkEl.textContent = 'Image API Error';
                  watermarkEl.setAttribute('data-error', 'true');
                  const loadingIndicator = container.querySelector('.image-loading-indicator');
                  if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    if (loadingIndicator) {
                      loadingIndicator.style.opacity = '0';
                      setTimeout(function() {
                        loadingIndicator.style.display = 'none';
                      }, 300);
                    }
                    watermarkEl.setAttribute('data-watermark-visible', 'true');
                    watermarkEl.classList.remove('opacity-0');
                    watermarkEl.classList.add('opacity-100');
                    const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
                    watermarkEl.style.opacity = originalOpacity;
                    watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
                  } else {
                    img.addEventListener('load', function() {
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        if (loadingIndicator) {
                          loadingIndicator.style.opacity = '0';
                          setTimeout(function() {
                            loadingIndicator.style.display = 'none';
                          }, 300);
                        }
                        watermarkEl.setAttribute('data-watermark-visible', 'true');
                        watermarkEl.classList.remove('opacity-0');
                        watermarkEl.classList.add('opacity-100');
                        const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
                        watermarkEl.style.opacity = originalOpacity;
                        watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
                      }
                    }, { once: true });
                  }
                }
              }
            }
          } catch (e) {}
        }
      });
    }
    
    function showLoadingIndicator(img) {
      if (!img.dataset.seed && img.dataset.preview !== 'true') {
        return;
      }
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const loadingIndicator = container.querySelector('.image-loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.classList.remove('hidden');
          loadingIndicator.style.removeProperty('opacity');
          loadingIndicator.style.removeProperty('display');
        }
      }
    }
    
    function hideLoadingIndicator(img) {
      if (!img.dataset.seed && img.dataset.preview !== 'true') {
        return;
      }
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const loadingIndicator = container.querySelector('.image-loading-indicator');
        if (loadingIndicator) {
          setTimeout(function() {
            loadingIndicator.style.setProperty('opacity', '0', 'important');
            loadingIndicator.style.setProperty('transition', 'opacity 0.3s ease-out', 'important');
            setTimeout(function() {
              loadingIndicator.style.setProperty('display', 'none', 'important');
              loadingIndicator.classList.add('hidden');
            }, 300);
          }, 800);
        }
      }
    }
    
    function showWatermark(img) {
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
        return;
      }
      hideLoadingIndicator(img);
      const container = img.closest('[id]') || img.parentElement;
      if (container) {
        const watermarkEl = container.querySelector('[data-watermark]');
        if (watermarkEl && watermarkEl.getAttribute('data-watermark-visible') !== 'true') {
          watermarkEl.setAttribute('data-watermark-visible', 'true');
          watermarkEl.classList.remove('opacity-0');
          watermarkEl.classList.add('opacity-100');
          const originalOpacity = watermarkEl.getAttribute('data-original-opacity') || '0.6';
          watermarkEl.style.opacity = originalOpacity;
          watermarkEl.style.setProperty('opacity', originalOpacity, 'important');
        }
      }
    }
    
    function optimizePreviewImages() {
      const previewImages = document.querySelectorAll('img[data-preview="true"]');
      previewImages.forEach(function(img) {
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
          showLoadingIndicator(img);
          img.addEventListener('loadstart', function() {
            showLoadingIndicator(img);
          }, { once: true });
        }
      });
    }
    
    function setupObserver() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              const apiImages = [];
              if (element.tagName === 'IMG' && element.dataset.seed && element.dataset.fallback) {
                apiImages.push(element);
              }
              const childApiImages = element.querySelectorAll ? element.querySelectorAll('img[data-seed][data-fallback]') : [];
              childApiImages.forEach(function(img) {
                if (!apiImages.includes(img)) {
                  apiImages.push(img);
                }
              });
              
              apiImages.forEach(function(img) {
                showLoadingIndicator(img);
                if (img.getAttribute('data-need-check-fallback') === 'true') {
                  checkAndUseFallbackForFailedApis();
                  img.removeAttribute('data-need-check-fallback');
                }
                if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                  hideLoadingIndicator(img);
                  showWatermark(img);
                } else {
                  img.addEventListener('loadstart', function() {
                    showLoadingIndicator(img);
                  }, { once: true });
                  img.addEventListener('load', function() {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                      hideLoadingIndicator(img);
                      showWatermark(img);
                    }
                  }, { once: true });
                  img.addEventListener('error', function() {
                    setTimeout(function() {
                      hideLoadingIndicator(img);
                    }, 500);
                  }, { once: true });
                }
              });
            }
          });
        });
      });
      
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    }
    
    function initializeImages() {
      if (isPageRefresh()) {
        clearApiFailureCache();
      } else {
        checkAndUseFallbackForFailedApis();
      }
      optimizePreviewImages();
      
      const allApiImages = document.querySelectorAll('img[data-seed][data-fallback]');
      allApiImages.forEach(function(img) {
        showLoadingIndicator(img);
        img.addEventListener('loadstart', function() {
          showLoadingIndicator(img);
        }, { once: true });
        
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          hideLoadingIndicator(img);
          showWatermark(img);
        } else {
          img.addEventListener('load', function() {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              hideLoadingIndicator(img);
              showWatermark(img);
            }
          }, { once: true });
          img.addEventListener('error', function() {
            setTimeout(function() {
              hideLoadingIndicator(img);
            }, 500);
          }, { once: true });
        }
      });
      
      setupObserver();
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeImages);
    } else {
      initializeImages();
    }
    
    // 监听页面可见性变化（从其他页面返回时重新检查）
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        if (!isPageRefresh()) {
          setTimeout(checkAndUseFallbackForFailedApis, 100);
        }
      }
    });
    
    // 监听popstate事件（浏览器前进/后退）
    window.addEventListener('popstate', function() {
      try {
        sessionStorage.setItem('random_cover_image_navigation_type', 'back_forward');
        sessionStorage.setItem('random_cover_image_last_init_time', Date.now().toString());
      } catch (e) {
        // 忽略错误
      }
      setTimeout(function() {
        checkAndUseFallbackForFailedApis();
      }, 50);
    });
}
