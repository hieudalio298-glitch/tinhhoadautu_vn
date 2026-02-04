# Verification Guide

To ensure the Stock Market Blog is fully functional, please follow these steps:

## 1. Setup Validation
- Ensure `.env.local` contains valid Supabase keys.
- Ensure `node_modules` are installed (`npm install`).

## 2. Testing Core Pages
- **Home**: Visit `http://localhost:3000`. Check Hero section, Stock Ticker (prices scrolling), and Featured Posts.
- **Stocks**: Visit `http://localhost:3000/stocks`. Click on a symbol (e.g., VNM). Verify the chart loads.
- **Blog**: Visit `http://localhost:3000/blog`. Test search bar and pagination (if enough posts).

## 3. Testing Authentication & Admin
- Click **"Đăng ký"**, create a new account.
- You should be redirected to Home.
- Visit `http://localhost:3000/admin`. You should see the Dashboard.
- Click **"Viết bài mới"**.
  - Enter Title.
  - Upload a cover image (check if preview appears).
  - Write content in the editor.
  - Click **"Đăng bài"**.
- Check `http://localhost:3000/blog` to see your new post.

## 4. Testing Comments
- Open your new post.
- Write a comment.
- Open the same page in Incognito mode.
- Verify the comment appears instantly (Realtime).

## Troubleshooting
- If images fail to upload, check Supabase Storage Policies for `blog-assets`.
- If chart data is empty, ensure `stock_prices` table has data (created in backend setup).
