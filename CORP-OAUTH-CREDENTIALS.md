# AeThex Corporation OAuth Credentials
**Foundation Passport SSO Integration**

## 🔐 OAuth Client Credentials

Add these to your **aethex.dev** environment variables (`.env` file):

```bash
# Foundation OAuth Provider Configuration
VITE_FOUNDATION_URL=https://aethex.foundation
FOUNDATION_OAUTH_CLIENT_ID=aethex_corp
FOUNDATION_OAUTH_CLIENT_SECRET=bcoEtyQVGr6Z4557658eUXpDF5FDni2TGNahH3HT-FtylNrLCYwydwLO0sbKVHtfYUnZc4flAODa4BXkzxD_qg
```

---

## 📋 OAuth Client Configuration

**Client Name:** AeThex Corporation  
**Client ID:** `aethex_corp`  
**Client Secret:** `bcoEtyQVGr6Z4557658eUXpDF5FDni2TGNahH3HT-FtylNrLCYwydwLO0sbKVHtfYUnZc4flAODa4BXkzxD_qg`

**Allowed Redirect URIs:**
- `https://aethex.dev/auth/callback` (Production)
- `http://localhost:3000/auth/callback` (Local development)

**Allowed Scopes:**
- `openid` - OpenID Connect authentication
- `profile` - User profile data (username, avatar, bio)
- `email` - User email address
- `achievements` - User achievements and badges
- `projects` - User projects (if applicable)

**Client Properties:**
- ✅ **Trusted Client** - Skips consent screen (first-party app)
- ✅ **Active** - Client is enabled and accepting requests
- 🔒 **Confidential Client** - Requires both client_secret AND PKCE

---

## 🔄 OAuth 2.0 Flow

**Authorization Code Flow with PKCE:**

1. **User clicks "Login with Foundation" on aethex.dev**
   - Corp generates `code_verifier` and `code_challenge`
   - Redirects to: `https://aethex.foundation/api/oauth/authorize`

2. **User authenticates on Foundation**
   - Foundation verifies user credentials
   - Foundation generates authorization code

3. **Foundation redirects back to Corp**
   - Redirects to: `https://aethex.dev/auth/callback?code=<auth_code>`

4. **Corp exchanges code for tokens**
   - POST to: `https://aethex.foundation/api/oauth/token`
   - Body (application/x-www-form-urlencoded):
     ```
     grant_type=authorization_code
     code=<auth_code>
     redirect_uri=https://aethex.dev/auth/callback
     client_id=aethex_corp
     client_secret=bcoEtyQVGr6Z4557658eUXpDF5FDni2TGNahH3HT-FtylNrLCYwydwLO0sbKVHtfYUnZc4flAODa4BXkzxD_qg
     code_verifier=<pkce_verifier>
     ```

5. **Foundation returns access token**
   - Response:
     ```json
     {
       "access_token": "<jwt_token>",
       "token_type": "Bearer",
       "expires_in": 3600,
       "refresh_token": "<refresh_token>",
       "scope": "openid profile email achievements projects"
     }
     ```

6. **Corp fetches user profile**
   - GET `https://aethex.foundation/api/oauth/userinfo`
   - Header: `Authorization: Bearer <access_token>`

---

## 🛠️ Implementation Checklist

- [ ] Add environment variables to `.env`
- [ ] Verify redirect URI matches exactly: `https://aethex.dev/auth/callback`
- [ ] Test PKCE generation (code_verifier → code_challenge)
- [ ] Implement token exchange endpoint
- [ ] Implement userinfo fetch endpoint
- [ ] Test full login flow end-to-end
- [ ] Verify refresh token rotation works
- [ ] Add error handling for OAuth errors

---

## 🔒 Security Notes

1. **Never expose `client_secret` in client-side code** - Store only on backend
2. **Always use HTTPS** in production (redirect URIs must match exactly)
3. **Validate state parameter** to prevent CSRF attacks
4. **Implement PKCE correctly** - code_verifier must be generated client-side
5. **Store refresh tokens securely** - Encrypt at rest, rotate on use
6. **Handle token expiration** - Access tokens expire in 1 hour

---

## 📞 Foundation OAuth Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Authorization | `https://aethex.foundation/api/oauth/authorize` | Start OAuth flow |
| Token Exchange | `https://aethex.foundation/api/oauth/token` | Exchange code for tokens |
| User Info | `https://aethex.foundation/api/oauth/userinfo` | Fetch user profile |

---

## ✅ Next Steps

1. **Copy credentials** to aethex.dev `.env` file
2. **Test login flow** in local development (`http://localhost:3000`)
3. **Deploy to production** with HTTPS redirect URIs
4. **Monitor OAuth logs** on Foundation side for debugging

---

**Generated:** November 17, 2025  
**Foundation Version:** Phase 3 Complete  
**Security Level:** Confidential Client (Secret + PKCE)
