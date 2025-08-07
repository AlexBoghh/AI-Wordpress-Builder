# Website Structure & Content Generator

A comprehensive web application for planning website structures, generating AI-powered content, and exporting to WordPress.

## Features

- 📁 CSV Upload: Import website structure from CSV files
- 🤖 AI Content Generation: Generate SEO-optimized content using Claude AI
- 📊 Project Management: Organize pages by menu hierarchy
- 📤 WordPress Export: Export projects as WordPress-ready XML files
- 🎨 Modern UI: Built with Next.js 14 and shadcn/ui components

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Claude API key (get one at https://console.anthropic.com/)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.example` to `.env.local` and add your API key:
```env
ANTHROPIC_API_KEY="your_claude_api_key_here"
# Database URL is optional - defaults to SQLite
DATABASE_URL="file:./prisma/dev.db"
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Upload CSV File

Use the sample CSV structure:
```csv
title,slug,menu,submenu,meta_description,keywords,content_type,priority
Home,home,Main,,Welcome message,home keywords,page,high
About,about,Main,,About our company,about keywords,page,high
```

A sample file is available at `/public/sample-website-structure.csv`

### 2. Generate Content

- Click on any page in your project
- Click "Generate Content" to create AI-powered content
- Content is generated based on title, meta description, and keywords

### 3. Export to WordPress

- Click "Export to WordPress" to download an XML file
- Import the XML file into WordPress using Tools > Import

## API Endpoints

- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/pages/[id]` - Update page content
- `POST /api/generate-content` - Generate AI content
- `GET /api/export/wordpress/[id]` - Export as WordPress XML

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API
- **File Processing**: Papa Parse (CSV), xml2js (XML)

## Project Structure

```
website-builder/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── projects/        # Project pages
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utilities
├── prisma/              # Database schema
├── public/              # Static files
└── types/               # TypeScript types
```

## Future Enhancements

- User authentication
- Real-time collaboration
- Custom content templates
- Advanced SEO analysis
- Batch content generation
- Media upload support

## License

MIT
