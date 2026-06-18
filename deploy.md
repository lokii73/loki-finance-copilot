# 🚀 StockGPT India – Instant GitHub & Vercel Deployment Guide

You can deploy your lightweight, pure **`index.html`** dashboard to Vercel for free in under 2 minutes! Vercel will host your frontend static panel, which will connect directly to your local FastAPI backend running on your computer.

Follow these simple commands inside your VS Code terminal to upload to GitHub and host on Vercel.

---

## 📂 Project Structure
Your deployment files are located here:
* 🌐 **Frontend Dashboard**: `C:\Users\WIN\.gemini\antigravity\scratch\stockgpt-india\index.html`
* ⚙️ **Vercel Config**: `C:\Users\WIN\.gemini\antigravity\scratch\stockgpt-india\vercel.json`

---

## 💻 Step-by-Step Deployment Instructions

### Step 1: Open VS Code Terminal
Open VS Code in your project directory `C:\Users\WIN\.gemini\antigravity\scratch\stockgpt-india`.

### Step 2: Initialize Git & Commit
Run these standard Git commands in your terminal to initialize your local repository and prepare the code:
```bash
# Initialize git repository
git init

# Add index.html and vercel.json (you can ignore Next/React folders)
git add index.html vercel.json

# Commit your lightweight files
git commit -m "Deploy premium StockGPT India Vanilla Dashboard"
```

### Step 3: Publish to GitHub
1. Go to **[github.com/new](https://github.com/new)** and create a new **Public** or **Private** repository named `stockgpt-india`.
2. Copy the remote commands provided by GitHub and run them in your VS Code terminal:
```bash
# Link your local repo to GitHub (replace with your actual GitHub username!)
git remote add origin https://github.com/YOUR_USERNAME/stockgpt-india.git
git branch -M main
git push -u origin main
```

---

## ☁️ Step 4: Deploy on Vercel (For Free!)

1. Go to **[vercel.com](https://vercel.com/)** and log in (sign up instantly using your GitHub account).
2. Click the **Add New...** button and select **Project**.
3. Import your newly created **`stockgpt-india`** repository from the list.
4. Under **Build & Development Settings**:
   * Leave **Framework Preset** as *Other* (it detects your `index.html` static setup automatically).
5. Click **Deploy**!

🎉 Within 15 seconds, Vercel will give you a live public production URL (e.g., `https://stockgpt-india.vercel.app`)!

---

## ⚙️ Running Your Backend Locally
Once your Vercel site is live, open it in any browser. It will seamlessly connect to the FastAPI API running on your machine:
```powershell
cd backend
$env:PATH = "C:\Users\WIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\LocalCache\local-packages\Python312\Scripts;" + $env:PATH
uvicorn app.main:app --reload --port 8000
```
This gives you a secure, blazing-fast web panel hosted on Vercel while keeping your sensitive financial and portfolio data processing safely on your local machine!
