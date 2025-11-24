## 🔐 **OAuth 弹窗认证流程详解**

### **阶段一：准备阶段**

```
用户访问登录页面
    ↓
前端从后端获取可用的 OAuth 提供商列表
GET /api/v1/auth/providers
    ↓
后端返回: ["github", "google", "facebook"]
    ↓
前端显示 OAuth 登录按钮
```

---

### **阶段二：发起认证**

```
用户点击 "GitHub 登录" 按钮
    ↓
前端 (Login.vue) 调用:
authStore.loginWithOAuth('github')
    ↓
1. 生成随机 state (用于防 CSRF 攻击)
   state = "abc123"
   sessionStorage.setItem('oauth_state', 'abc123')
    ↓
2. 调用后端获取 GitHub 授权 URL
   GET /api/v1/auth/oauth/github?state=abc123
    ↓
后端返回:
{
  "auth_url": "https://github.com/login/oauth/authorize?
               client_id=xxx&
               redirect_uri=http://localhost:5173/auth/callback/github&
               state=abc123&
               scope=user:email"
}
    ↓
3. 前端打开弹窗
   window.open(auth_url, '600x700 居中弹窗')
```

---

### **阶段三：用户授权（在弹窗中）**

```
弹窗跳转到 GitHub 授权页面
    ↓
用户看到:
"CodeTogether 想要访问你的 GitHub 账号"
[取消] [授权]
    ↓
用户点击 "授权"
    ↓
GitHub 重定向到前端回调 （CallBack.vue组件）:
http://localhost:5173/auth/callback/github?code=github_code_xyz&state=abc123
```

---

### **阶段四：后端处理**
CallBack.vue组件调用后端接口
```go
func (h *AuthHandler) OAuthCallback(c echo.Context) error {
    provider := "github"
    code := "github_code_xyz"  // GitHub 返回的授权码
    state := "abc123"          // 验证 state
    
    // 1. 用 code 向 GitHub 换取 access_token
    token := exchangeCodeForToken(code)
    // token.AccessToken = "gho_xxxxxxxxxxxxx"
    
    // 2. 用 access_token 获取用户信息
    userInfo := getUserInfoFromGitHub(token)
    // userInfo = {
    //   id: "99305961",
    //   login: "Breeze1203",
    //   avatar_url: "https://avatars.githubusercontent.com/u/99305961",
    //   email: ""
    // }
    
    // 3. 在数据库中查找或创建用户
    user := findOrCreateUser(userInfo)
    // user.ID = 2
    // user.Username = "Breeze1203"
    // user.Provider = "github"
    
    // 4. 生成你的 JWT token
    authResponse := generateJWT(user)
    
    // 5. 返回 JSON（关键！）
    return c.JSON(200, authResponse)
}
```

**返回的 JSON:**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": 2,
    "username": "Breeze1203",
    "email": "",
    "provider": "github",
    "avatar": "https://avatars.githubusercontent.com/u/99305961"
  }
}
```

---

### **阶段五：弹窗页面接收响应**

```javascript
// OAuthCallback.vue 在弹窗中运行
onMounted(async () => {
  // 1. 从 URL 获取参数
  const code = "github_code_xyz"
  const state = "abc123"
  const provider = "github"
  
  // 2. 调用后端回调接口（重要！）
  const response = await axios.get(
    `http://localhost:8080/api/v1/auth/oauth/github/callback`,
    { params: { code, state } }
  )
  
  // 3. 获取后端返回的 JSON
  const authData = response.data  // 就是上面的 JSON
  
  // 4. 发送给父窗口（Login.vue）
  window.opener.postMessage({
    type: 'oauth-success',
    authData: authData
  }, window.location.origin)
  
  // 5. 1秒后自动关闭弹窗
  setTimeout(() => window.close(), 1000)
})
```

---

### **阶段六：父窗口接收数据**

```javascript
// Login.vue 中监听消息
window.addEventListener('message', async (event) => {
  // 1. 安全检查：确保消息来自同源
  if (event.origin !== window.location.origin) return
  
  if (event.data.type === 'oauth-success') {
    // 2. 接收认证数据
    const { authData } = event.data
    
    // 3. 验证 state
    const savedState = sessionStorage.getItem('oauth_state')
    // savedState === "abc123" ✓
    
    // 4. 保存 token 到 localStorage
    localStorage.setItem('access_token', authData.access_token)
    localStorage.setItem('refresh_token', authData.refresh_token)
    localStorage.setItem('user', JSON.stringify(authData.user))
    
    // 5. 更新 Pinia store
    user.value = authData.user
    accessToken.value = authData.access_token
    
    // 6. 关闭弹窗
    popup.close()
    
    // 7. 跳转到 Dashboard
    router.push('/dashboard')
  }
})
```

---

### **阶段七：用户已登录**

```
用户进入 Dashboard
    ↓
显示用户信息:
- 头像: https://avatars.githubusercontent.com/u/99305961
- 用户名: Breeze1203
- 登录方式: GitHub
    ↓
后续请求都带上 access_token:
Authorization: Bearer eyJhbGci...
```

---

## 📊 **流程图（简化版）**

```
[用户] ──点击登录──> [Login.vue]
                        │
                        │ 1. 获取 OAuth URL
                        ↓
                    [后端 API]
                        │
                        │ 2. 返回 GitHub 授权 URL
                        ↓
                    [弹出窗口]
                        │
                        │ 3. 用户授权
                        ↓
                    [GitHub]
                        │
                        │ 4. 重定向 + code
                        ↓
            [前端CallBack组件 调用后端 /callback 接口]
                        │
                        │ 5. 换取 token & 用户信息
                        │ 6. 生成 JWT
                        ↓
                    [返回 JSON]
                        │
                        │ 7. 弹窗接收 JSON
                        ↓
              [OAuthCallback.vue]
                        │
                        │ 8. postMessage
                        ↓
                   [Login.vue]
                        │
                        │ 9. 保存 token
                        │ 10. 关闭弹窗
                        ↓
                   [Dashboard]
```

---

## 🔑 **关键点说明**

### **1. State 的作用（防 CSRF）**
```
前端生成: state = "abc123"
         ↓
发给 GitHub: ?state=abc123
         ↓
GitHub 原样返回: ?state=abc123
         ↓
前端验证: savedState === returnedState ✓
```

### **2. 为什么需要两次请求后端？**

**第一次:** 获取 GitHub 授权 URL
```
GET /api/v1/auth/oauth/github?state=abc123
返回: { auth_url: "https://github.com/..." }
```

**第二次:** 用 code 换取 token（在弹窗中）
```
GET /api/v1/auth/oauth/github/callback?code=xxx&state=abc123
返回: { access_token: "...", user: {...} }
```

### **3. 为什么用 postMessage？**

- ✅ 安全：只能同源通信
- ✅ 跨窗口：弹窗可以给父窗口发消息
- ✅ 异步：不阻塞主线程

---

## 🚨 **常见问题**

### **Q1: 为什么后端返回 JSON 而不是重定向？**
**A:** 你的后端设计是返回 JSON，这样可以：
- 前端完全控制跳转逻辑
- 可以在弹窗中处理
- 更灵活

### **Q2: 如果用户拒绝授权会怎样？**
**A:** GitHub 会重定向到：
```
/callback?error=access_denied&state=abc123
```
前端应该处理这个错误。

### **Q3: Token 存在哪里？**
**A:**
- `access_token` → localStorage（短期，24小时）
- `refresh_token` → localStorage（长期，30天）
- `user` → localStorage（用户信息）

### **Q4: 如果弹窗被浏览器阻止？**
**A:** 需要用户手动允许弹窗，或改用全页面重定向方式。

---

## ✅ **总结**

整个流程的核心是：
1. **前端发起** → 打开弹窗到 GitHub
2. **用户授权** → GitHub 返回 code
3. **后端处理** → 前端拿到 code， 换取 token，返回 JSON
4. **弹窗接收** → 拿到 JSON，发给父窗口
5. **父窗口保存** → 存 token，跳转 Dashboard

