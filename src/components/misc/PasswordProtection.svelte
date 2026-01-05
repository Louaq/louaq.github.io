<script lang="ts">
  import { onMount } from "svelte";
  
  export let postId: string;
  export let password: string;
  
  let inputPassword = "";
  let errorMessage = "";
  let isUnlocked = false;
  let isShaking = false;
  
  // 使用简单的哈希函数来存储密码状态
  function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  
  // 检查是否已经解锁
  function checkUnlocked(): boolean {
    const storageKey = `post_unlock_${simpleHash(postId)}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // 检查密码哈希是否匹配
        if (data.hash === simpleHash(password) && data.timestamp) {
          // 密码有效期为24小时
          const now = Date.now();
          if (now - data.timestamp < 24 * 60 * 60 * 1000) {
            return true;
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
    return false;
  }
  
  // 保存解锁状态
  function saveUnlockState() {
    const storageKey = `post_unlock_${simpleHash(postId)}`;
    const data = {
      hash: simpleHash(password),
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  
  // 验证密码
  function verifyPassword() {
    if (inputPassword === password) {
      errorMessage = "";
      isUnlocked = true;
      saveUnlockState();
      
      // 发送自定义事件通知父组件
      window.dispatchEvent(new CustomEvent("password-unlocked", { detail: { postId } }));
    } else {
      errorMessage = "密码错误，请重试";
      isShaking = true;
      
      // 清空输入框
      inputPassword = "";
      
      // 移除抖动效果
      setTimeout(() => {
        isShaking = false;
      }, 500);
    }
  }
  
  // 处理键盘事件
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      verifyPassword();
    }
  }
  
  onMount(() => {
    // 检查是否已经解锁
    isUnlocked = checkUnlocked();
    
    if (isUnlocked) {
      // 如果已经解锁，通知父组件
      window.dispatchEvent(new CustomEvent("password-unlocked", { detail: { postId } }));
    }
  });
</script>

{#if !isUnlocked}
<div class="password-protection-container">
  <div class="password-protection-card" class:shake={isShaking}>
    <div class="lock-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    
    <h2 class="password-title">此文章已加密</h2>
    <p class="password-description">请输入密码查看文章内容</p>
    
    <div class="password-input-group">
      <input 
        type="password" 
        bind:value={inputPassword}
        on:keypress={handleKeyPress}
        placeholder="请输入密码"
        class="password-input"
        autocomplete="off"
      />
      <button 
        class="password-button" 
        on:click={verifyPassword}
      >
        解锁
      </button>
    </div>
    
    {#if errorMessage}
      <div class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{errorMessage}</span>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .password-protection-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 2rem 1rem;
  }
  
  .password-protection-card {
    background: var(--card-bg);
    border-radius: var(--radius-large);
    padding: 3rem 2rem;
    max-width: 400px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .password-protection-card.shake {
    animation: shake 0.5s;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .lock-icon {
    color: var(--primary);
    margin-bottom: 1.5rem;
    display: inline-flex;
    padding: 1rem;
    background: var(--primary-bg, rgba(var(--primary-rgb, 74, 222, 128), 0.1));
    border-radius: 50%;
  }
  
  .password-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #1a1a1a);
  }
  
  :global(.dark) .password-title {
    color: var(--text-primary, #f5f5f5);
  }
  
  .password-description {
    font-size: 1rem;
    color: var(--text-secondary, #666);
    margin-bottom: 2rem;
  }
  
  :global(.dark) .password-description {
    color: var(--text-secondary, #aaa);
  }
  
  .password-input-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .password-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--line-divider, #e5e5e5);
    border-radius: var(--radius-medium, 0.5rem);
    font-size: 1rem;
    background: var(--input-bg, #fff);
    color: var(--text-primary, #1a1a1a);
    transition: all 0.3s ease;
    outline: none;
  }
  
  .password-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb, 74, 222, 128), 0.1);
  }
  
  :global(.dark) .password-input {
    background: var(--input-bg, #2a2a2a);
    color: var(--text-primary, #f5f5f5);
    border-color: var(--line-divider, #404040);
  }
  
  .password-button {
    padding: 0.75rem 2rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-medium, 0.5rem);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  .password-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .password-button:active {
    transform: translateY(0);
  }
  
  :global(.dark) .password-button {
    color: var(--dark-button-text, #1a1a1a);
  }
  
  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #ef4444;
    font-size: 0.875rem;
    padding: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-small, 0.375rem);
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 响应式设计 */
  @media (max-width: 640px) {
    .password-protection-card {
      padding: 2rem 1.5rem;
    }
    
    .password-title {
      font-size: 1.5rem;
    }
    
    .password-input-group {
      flex-direction: column;
    }
    
    .password-button {
      width: 100%;
    }
  }
</style>

