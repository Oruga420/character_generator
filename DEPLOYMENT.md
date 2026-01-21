# 🚀 Deployment Guide - Character Generator Pro

## ✅ Code Deployed to GitHub

Your repository: **https://github.com/Oruga420/character_generator**

## 🌐 Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ **Built for Next.js** (same creators)
- ✅ **Free tier** includes:
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic HTTPS
  - Global CDN
- ✅ **One-click deploy**
- ✅ **Environment variables** built-in
- ✅ **Automatic deployments** on git push

### Steps to Deploy

#### 1. Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with **GitHub** (easiest)

#### 2. Import Your Project
1. Click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Choose **`Oruga420/character_generator`**
4. Click **"Import"**

#### 3. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)

#### 4. Add Environment Variables
Click **"Environment Variables"** and add:

```
DATABASE_URL=postgresql://your_neon_connection_here
GROQ_API_KEY=gsk_your_groq_key_here
REPLICATE_API_TOKEN=r8_your_replicate_token_here
```

**Important**: Use your Neon **Pooled** connection string for serverless

#### 5. Deploy
Click **"Deploy"** and wait ~2 minutes

#### 6. Done! 🎉
Your app will be live at: `https://character-generator-xxx.vercel.app`

### After First Deploy

#### Update Environment Variables
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add/Edit variables
4. Redeploy for changes to take effect

#### Custom Domain (Optional)
1. Settings → Domains
2. Add your domain
3. Follow DNS instructions

#### Automatic Deployments
Every time you push to GitHub main branch:
- ✅ Vercel automatically deploys
- ✅ Preview URLs for pull requests
- ✅ Rollback to previous versions anytime

---

## 🔧 Alternative Deployment Options

### Netlify
1. Go to https://netlify.com
2. Add new site from Git
3. Choose your repo
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy

### Railway
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Choose repo
4. Add environment variables
5. Railway auto-detects Next.js

### Self-Hosted (VPS/Docker)

#### Using PM2
```bash
# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "character-gen" -- start

# Save PM2 config
pm2 save
pm2 startup
```

#### Using Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t character-gen .
docker run -p 3000:3000 --env-file .env.local character-gen
```

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use `.env.example` as template
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod

### Database
- ✅ Use Neon's **Pooled** connection for serverless
- ✅ Enable connection pooling
- ✅ Set up read replicas for production

### API Keys
- ✅ Keep Groq/Replicate keys server-side only
- ✅ Implement rate limiting for API routes
- ✅ Monitor usage in respective dashboards

---

## 📊 Production Checklist

Before going live:

### Code
- [ ] Run `npm run build` locally (no errors)
- [ ] Test all features work
- [ ] Check browser console (no errors)
- [ ] Test on mobile devices

### Database
- [ ] Import all characters to Neon production DB
- [ ] Test character search
- [ ] Verify connection pooling enabled

### APIs
- [ ] Test Groq prompt generation
- [ ] Test Replicate image generation (both models)
- [ ] Test chatbot responses
- [ ] Verify API keys are production keys

### Performance
- [ ] Enable Next.js caching
- [ ] Optimize images (if any custom ones)
- [ ] Test load times
- [ ] Monitor API usage

### Monitoring
- [ ] Set up Vercel Analytics (free)
- [ ] Monitor Groq API usage
- [ ] Monitor Replicate costs
- [ ] Check Neon database metrics

---

## 💰 Cost Estimation (Production)

### Free Tier (Development/Low Traffic)
- **Vercel**: Free
- **Groq**: Free (30 req/min)
- **Neon**: Free (0.5GB, 300hrs)
- **Replicate**: Pay per image (~$0.05-0.15)

**Monthly**: ~$10-30 (100-200 images)

### Medium Traffic (1000 users/month)
- **Vercel**: Free (within limits)
- **Groq**: Free (upgrade if needed)
- **Neon**: Free or $10/month (Pro)
- **Replicate**: $100-300 (2000 images)

**Monthly**: ~$110-310

### High Traffic (10k+ users/month)
- **Vercel**: $20/month (Pro)
- **Groq**: Free or paid tier
- **Neon**: $10-50/month
- **Replicate**: $500-1500 (scale)

**Monthly**: $530-1570

---

## 🐛 Troubleshooting Deployment

### Build Fails
- Check Node version (need 18+)
- Verify all dependencies installed
- Check build logs in Vercel

### Environment Variables Not Working
- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Database Connection Fails
- Use Neon **Pooled** connection string
- Verify `?sslmode=require` is at the end
- Check IP allowlist in Neon (allow all for Vercel)

### Images Not Generating
- Verify Replicate API token is valid
- Check Replicate dashboard for errors
- Ensure sufficient credits

### Groq API Errors
- Verify API key is production key
- Check rate limits (30 req/min free)
- Monitor usage in Groq dashboard

---

## 📈 Scaling Tips

### When You Grow
1. **Upgrade Groq**: Paid tier for higher limits
2. **Neon Auto-scaling**: Automatically scales with traffic
3. **Vercel Pro**: Better performance, analytics
4. **Caching**: Implement Redis for common prompts
5. **CDN**: Use for generated images

### Performance Optimization
- Enable Next.js Image Optimization
- Implement request caching
- Add loading skeletons
- Optimize API routes

---

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - Create a test character
   - Generate prompts
   - Generate images
   - Test chatbot

2. **Share Your App**
   - Get feedback from users
   - Monitor error logs
   - Iterate based on feedback

3. **Monitor Costs**
   - Check Replicate usage daily
   - Set up billing alerts
   - Optimize expensive operations

4. **Keep Updated**
   - Update dependencies regularly
   - Monitor security advisories
   - Back up your database

---

## 📱 Your Live URLs

After deployment:

- **App**: `https://character-generator-[hash].vercel.app`
- **GitHub**: https://github.com/Oruga420/character_generator
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Congratulations on deploying!** 🎉

For support, check the deployment platform's docs:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
