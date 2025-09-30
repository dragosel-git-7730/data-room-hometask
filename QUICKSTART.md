# 🚀 Quick Start Guide

## Running the Data Room MVP

### Option 1: Automated Start (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh && ./start.sh
```

### Option 2: Manual Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🎯 What to Expect

- **Demo Data**: Sample folders and files are automatically loaded on first visit
- **Upload PDFs**: Click "Upload PDF" to add files
- **Create Folders**: Click "New Folder" to organize content
- **Navigate**: Click folders to enter them, use breadcrumbs to go back
- **Rename**: Double-click any item to rename it
- **Delete**: Hover over items and click "Delete"

## 📁 Sample Data Included

- **Contracts** folder with legal documents
- **Financial Documents** folder with reports
- **Nested folders** demonstrating hierarchy
- **Sample PDF files** with realistic names and sizes

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Run on different port
npm run dev -- -p 3001
```

### Clear Cache Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Production Build

```bash
npm run build
npm start
```

## 📱 Features to Test

- ✅ Create folders and files
- ✅ Navigate folder hierarchy  
- ✅ Upload PDF files
- ✅ Rename items (double-click)
- ✅ Delete items with confirmation
- ✅ Error handling (try duplicate names)
- ✅ Mobile responsive design
- ✅ Data persistence (refresh page)

**Enjoy exploring your Data Room MVP!** 🎉