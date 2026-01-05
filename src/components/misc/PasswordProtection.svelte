<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  
  export let postId: string;
  export let password: string;
  
  let inputPassword = "";
  let errorMessage = "";
  let isUnlocked = false;
  let isShaking = false;
  let isFrozen = false;
  let remainingTime = 0;
  let countdownInterval: number | null = null;
  
  const MAX_ATTEMPTS = 3; // 最大尝试次数
  const BASE_FREEZE_TIME = 5 * 60 * 1000; // 基础冻结时间：5分钟（毫秒）
  const STORAGE_KEY = `password_freeze_${postId}`;
  
  // 获取冻结状态
  function getFreezeState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // 忽略解析错误
    }
    return { attempts: 0, freezeCount: 0, freezeUntil: 0 };
  }
  
  // 保存冻结状态
  function saveFreezeState(state: { attempts: number; freezeCount: number; freezeUntil: number }) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // 忽略存储错误
    }
  }
  
  // 检查是否处于冻结状态
  function checkFrozen() {
    const state = getFreezeState();
    const now = Date.now();
    
    if (state.freezeUntil > now) {
      isFrozen = true;
      remainingTime = Math.ceil((state.freezeUntil - now) / 1000);
      startCountdown();
      return true;
    } else if (state.freezeUntil > 0) {
      // 冻结时间已过，重置尝试次数，但保留冻结计数
      state.attempts = 0;
      state.freezeUntil = 0;
      saveFreezeState(state);
    }
    
    isFrozen = false;
    return false;
  }
  
  // 开始倒计时
  function startCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    countdownInterval = window.setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateErrorMessage();
      } else {
        isFrozen = false;
        errorMessage = "";
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
      }
    }, 1000);
  }
  
  // 更新错误消息
  function updateErrorMessage() {
    if (isFrozen && remainingTime > 0) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      errorMessage = `输入错误次数过多，请等待 ${minutes}分${seconds}秒 后重试`;
    }
  }
  
  // 格式化时间显示
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  }
  
  // 验证密码
  function verifyPassword() {
    // 检查是否处于冻结状态
    if (checkFrozen()) {
      updateErrorMessage();
      isShaking = true;
      setTimeout(() => {
        isShaking = false;
      }, 500);
      return;
    }
    
    if (inputPassword === password) {
      // 密码正确，清除冻结状态
      localStorage.removeItem(STORAGE_KEY);
      errorMessage = "";
      isUnlocked = true;
      
      // 发送自定义事件通知父组件
      window.dispatchEvent(new CustomEvent("password-unlocked", { detail: { postId } }));
    } else {
      // 密码错误
      const state = getFreezeState();
      state.attempts++;
      
      if (state.attempts >= MAX_ATTEMPTS) {
        // 达到最大尝试次数，进入冻结
        state.freezeCount++;
        const freezeDuration = BASE_FREEZE_TIME * state.freezeCount;
        state.freezeUntil = Date.now() + freezeDuration;
        state.attempts = 0; // 重置尝试次数
        
        saveFreezeState(state);
        
        isFrozen = true;
        remainingTime = Math.ceil(freezeDuration / 1000);
        updateErrorMessage();
        startCountdown();
      } else {
        // 显示剩余尝试次数
        const remainingAttempts = MAX_ATTEMPTS - state.attempts;
        errorMessage = `密码错误，还剩 ${remainingAttempts} 次尝试机会`;
        saveFreezeState(state);
      }
      
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
    if (event.key === "Enter" && !isFrozen) {
      verifyPassword();
    }
  }
  
  // 组件挂载时检查冻结状态
  onMount(() => {
    checkFrozen();
  });
  
  // 组件销毁时清理定时器
  onDestroy(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
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
        class:disabled={isFrozen}
        autocomplete="off"
        disabled={isFrozen}
      />
      <button 
        class="password-button" 
        class:disabled={isFrozen}
        on:click={verifyPassword}
        disabled={isFrozen}
      >
        {isFrozen ? '已冻结' : '解锁'}
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
  
  .password-input:disabled,
  .password-input.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--input-bg-disabled, #f5f5f5);
  }
  
  :global(.dark) .password-input {
    background: var(--input-bg, #2a2a2a);
    color: var(--text-primary, #f5f5f5);
    border-color: var(--line-divider, #404040);
  }
  
  :global(.dark) .password-input:disabled,
  :global(.dark) .password-input.disabled {
    background: var(--input-bg-disabled, #1a1a1a);
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
  
  .password-button:disabled,
  .password-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .password-button:disabled:hover,
  .password-button.disabled:hover {
    opacity: 0.5;
    transform: none;
    box-shadow: none;
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
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-small, 0.375rem);
    animation: fadeIn 0.3s ease;
    font-weight: 500;
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

