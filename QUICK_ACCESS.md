# Quick Access to Admin Panel

## Method 1: Login with ANY credentials

The login page currently uses **mock authentication** for development.

1. Go to: `http://localhost:5173/login`
2. Enter **ANY** email (e.g., `admin@test.com`)
3. Enter **ANY** password (e.g., `password123`)
4. Click "Sign In"

You'll be logged in immediately!

## Method 2: Bypass Login (Quick Dev Access)

Open browser console (F12) and run:

```javascript
localStorage.setItem("isAuthenticated", "true");
window.location.href = '/dashboard';
```

Then refresh the page - you'll be logged in!

## Method 3: Disable Auth Temporarily

If you want to completely bypass authentication during development, you can temporarily disable it.

Edit `src/lib/auth.tsx` and change:

```typescript
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Temporarily disabled for development
  return <>{children}</>;
};
```

## Checking Current Status

To check if you're logged in, open console and run:

```javascript
console.log('Logged in:', localStorage.getItem("isAuthenticated"));
```

## If You See a Blank Screen

1. **Check the URL** - You might be at `/` which redirects to `/dashboard`
2. **Check console errors** - Press F12 and look for red errors
3. **Clear cache** - Sometimes Vite cache causes issues
   ```bash
   # Stop server, then:
   rm -rf node_modules/.vite
   npm run dev
   ```
4. **Try accessing `/login` directly**: `http://localhost:5173/login`

## To See the Debug Page

Once logged in, navigate to:
```
http://localhost:5173/debug
```

This will show you exactly what data is in your Supabase database!

---

**TL;DR**: Just go to `/login` and enter any email/password to access the admin panel!
