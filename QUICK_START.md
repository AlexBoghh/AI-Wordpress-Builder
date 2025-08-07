# Quick Start Guide

Your Website Builder application is now running! 🎉

## Access the Application

Open your browser and go to: **http://localhost:3000**

## Test the Application

1. **Upload Sample CSV**
   - On the homepage, you'll see a file upload area
   - Click "Choose File" or drag and drop
   - Select the sample file: `public/sample-website-structure.csv`
   - The file will be automatically processed

2. **View Your Project**
   - After upload, you'll be redirected to the project page
   - You'll see all pages organized by menu structure
   - Click on any page to view its details

3. **Generate AI Content**
   - Select a page from the sidebar
   - Click "Generate Content" button
   - AI will create SEO-optimized content based on the page metadata
   - Content will appear in the preview area

4. **Export to WordPress**
   - Click "Export to WordPress" button in the header
   - An XML file will download automatically
   - Import this file into WordPress using Tools > Import

## Database Location

Your SQLite database is located at: `dev.db`

## Stop the Server

Press `Ctrl + C` in the terminal to stop the server.

## Troubleshooting

If you encounter any issues:
1. Make sure all dependencies are installed: `npm install`
2. Ensure the database is created: `npx prisma db push`
3. Check that your Gemini API key is valid in `.env.local`

Enjoy building your websites! 🚀