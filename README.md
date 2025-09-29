# Coplit - Document Formatting SaaS

Professional document formatting with seamless Arabic/RTL support. Transform your Word documents into publication-ready PDFs with an intuitive interface and powerful formatting capabilities.

## 🚀 Features

- **Seamless RTL/LTR Support**: Perfect Arabic and English rendering with intelligent text direction handling
- **Real-time Preview**: Instant feedback with live document previews
- **Professional Quality**: Publication-ready PDFs for academic, legal, and business documents
- **Intuitive Wizard**: Step-by-step formatting configuration interface
- **Multiple Formats**: Support for various page sizes, fonts, and layout options
- **Secure & Private**: Enterprise-grade security with encrypted file storage

## 🏗️ Architecture

### Backend
- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: PostgreSQL 15+
- **Task Queue**: Celery + Redis
- **Storage**: S3-compatible (MinIO for development)
- **Authentication**: JWT-based authentication

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS with custom Arabic font support
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite

## 🛠️ Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coplit
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/
   - MinIO Console: http://localhost:9001 (admin/admin123)

### Local Development

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📁 Project Structure

```
coplit/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles and Tailwind config
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Django backend API
│   ├── coplit_backend/
│   │   ├── apps/           # Django applications
│   │   │   ├── users/      # User management
│   │   │   ├── documents/  # Document handling
│   │   │   └── formatting/ # Formatting engine
│   │   ├── settings/       # Django settings
│   │   └── urls.py
│   ├── requirements.txt
│   └── manage.py
├── docker/                  # Docker configurations
├── docs/                   # Documentation
└── docker-compose.yml
```

## 🎯 Core Features Implementation

### Document Upload
- Drag-and-drop interface
- File validation (.docx, 50MB limit)
- Progress tracking
- Error handling

### Formatting Wizard
- **Page Settings**: Size, orientation, margins
- **Typography**: Fonts, sizes, Arabic options
- **Layout**: Columns, spacing, alignment
- **Headers/Footers**: Custom headers, footers, page numbers
- **Preview**: Real-time document preview
- **Download**: PDF generation and download

### Arabic/RTL Support
- Bidirectional text rendering
- Arabic font selection (Amiri, Noto Naskh, etc.)
- RTL layout support
- Mixed content handling

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
python manage.py test
```

## 🚀 Deployment

### Production Docker Setup
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Create `.env` files for each service:

#### Backend `.env`
```
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

#### Frontend `.env`
```
VITE_API_URL=https://api.coplit.com
```

## 📊 Business Model

- **Free Tier**: 5 documents/month, basic features
- **Pro**: $29/month - unlimited docs, all features  
- **Team**: $99/month - 5 users, priority support
- **Enterprise**: Custom pricing, on-premise option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌍 Internationalization

The application supports both English and Arabic languages with:
- RTL/LTR text direction switching
- Arabic typography and fonts
- Localized user interface
- Bidirectional document handling

## 🔧 Technical Decisions

### Why Django + React?
- **Django**: Robust backend framework with excellent ORM and admin interface
- **React**: Modern frontend with great ecosystem and TypeScript support
- **Separation**: Clean API-first architecture for scalability

### Why Zustand?
- Lightweight state management
- TypeScript-first design
- Minimal boilerplate

### Why Tailwind CSS?
- Utility-first approach
- Excellent RTL support
- Custom design system capabilities