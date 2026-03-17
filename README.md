# HVAC Services - Full Stack Application

A production-ready marketplace platform for HVAC (Heating, Ventilation, and Air Conditioning) services with AI chatbot integration, PayPal payments, and subscription tiers.

## 🚀 Features

- **User Authentication**: Email-based JWT authentication with 30-day access tokens
- **Role-Based Access Control**: Admin, Seller, and User roles with specific permissions
- **Service Marketplace**: Browse and purchase HVAC services from verified sellers
- **AI Chatbot**: Subscription-aware Gemini-powered chatbot with usage tracking
- **Payment Integration**: PayPal subscription management with 3 tier plans
- **Seller Dashboard**: Manage HVAC services and view transactions
- **Admin Panel**: Manage users, sellers, subscriptions, and service approvals
- **Dynamic Image Uploads**: Services with custom image handling and media serving
- **Bootstrap UI**: Modern, responsive interface using Bootstrap 5

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- SQLite3
- Google Gemini API Key
- PayPal Developer Account

## 🛠️ Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # Update with your API keys

# Run migrations
python manage.py migrate

# Load sample data
python manage.py loaddata subscriptions services users orders

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > .env
echo "REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID" >> .env

# Start development server
npm start
```

## 📁 Project Structure

```
quiz6/
├── backend/                 # Django REST API
│   ├── applications/        # Seller applications
│   ├── chat/               # AI Chatbot with Gemini
│   ├── orders/             # Purchase orders
│   ├── services/           # HVAC Services listing
│   ├── subscriptions/      # Subscription tiers & management
│   ├── users/              # Authentication & profiles
│   ├── backend/            # Django settings & URLs
│   └── manage.py
│
└── frontend/                # React SPA
    ├── src/
    │   ├── actions/        # Redux async actions
    │   ├── components/     # Reusable components
    │   ├── reducers/       # Redux state management
    │   ├── screens/        # Page components
    │   ├── App.js
    │   ├── index.js
    │   └── store.js
    └── package.json
```

## 🔐 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-django-secret
DEBUG=True
GEMINI_API_KEY=your-google-gemini-api-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PAYPAL_MODE=sandbox
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## 🧑‍💻 Test Accounts

Pre-loaded test users (password: `password123` for all):

| Email | Role | Purpose |
|-------|------|---------|
| admin@hvac.com | Admin | System administration |
| john@hvac.com | User | Browse & purchase services |
| hvac_pro@hvac.com | Seller | Manage & sell services |

## 📚 API Endpoints

### Authentication
- `POST /api/v1/users/login/` - Email-based login
- `POST /api/v1/users/register/` - User registration
- `GET /api/v1/users/profile/` - Get user profile with subscription

### Services
- `GET /api/v1/services/` - List all services
- `GET /api/v1/services/{id}/` - Get service details
- `POST /api/v1/services/` - Create service (sellers only)

### Chatbot
- `POST /api/v1/chat/ask/` - Send message to AI chatbot
  - Requires active subscription
  - Auto-decrements usage_left

### Subscriptions
- `GET /api/v1/subscriptions/` - List subscription tiers
- `POST /api/v1/subscriptions/subscribe/` - Subscribe to tier

### Orders
- `POST /api/v1/orders/create/` - Create purchase order
- `GET /api/v1/orders/` - List user's orders

## 🎯 Key Technical Details

### Subscription Tiers
- **Starter**: 3 chat messages/month - $9.99
- **Professional**: 5 chat messages/month - $19.99
- **Premium**: 10 chat messages/month - $39.99

### JWT Authentication
- Access token lifetime: 30 days
- Refresh token lifetime: 1 day
- Email-based login (not username)
- Includes user role in token payload

### Image Handling
- Dynamic upload paths: `img/{random_id}/{filename}`
- Served via Django media files at `/media/`
- Placeholder icons for missing images

### AI Chatbot
- Powered by Google Gemini API
- Subscription validation before each message
- Usage tracking and limits enforcement
- HVAC-specific context prompts

### PayPal Integration
- Vault mode for subscriptions
- Per-tier plan IDs stored in database
- Sandbox environment for testing

## 🚀 Deployment Checklist

- [ ] Update `DEBUG=False` in backend .env
- [ ] Set `ALLOWED_HOSTS` in Django settings
- [ ] Update CORS origins for production domain
- [ ] Use production PayPal credentials
- [ ] Configure proper database (PostgreSQL recommended)
- [ ] Set up media file storage (S3 or similar)
- [ ] Add SSL certificates and HTTPS
- [ ] Set up proper logging and monitoring
- [ ] Configure environment variables securely

## 🐛 Troubleshooting

### Chatbot stuck at loading
- Verify `GEMINI_API_KEY` is set in backend .env
- Check frontend API URL in .env file
- Verify user has active subscription
- Check browser console for error messages

### PayPal buttons not rendering
- Ensure `REACT_APP_PAYPAL_CLIENT_ID` is in frontend .env
- Verify PayPal SDK loads (check Network tab)
- Clear browser cache and restart dev server

### Authentication fails
- Verify user exists with email address (not username)
- Check JWT tokens in localStorage
- Verify `SECRET_KEY` in backend .env

### Images not loading
- Check media folder exists at `/backend/media/`
- Verify Django `MEDIA_URL` and `MEDIA_ROOT` settings
- Check file permissions on media directory

## 📦 Dependencies

### Backend (7 packages)
- Django 6.0.1
- djangorestframework 3.14.0
- djangorestframework-simplejwt 5.3.0
- django-cors-headers 4.3.1
- Pillow 10.0.0
- python-dotenv 1.0.1
- google-genai (Gemini API)

### Frontend (13 packages)
- React 19.2.4
- React Bootstrap 2.10.0
- Bootstrap 5.3.2
- Redux & Redux Thunk
- React Router DOM 6.20.0
- Axios 1.6.2
- Font Awesome 6.4.0 (CDN)

## 📝 License

This project is proprietary and confidential.

## 👨‍💻 Support

For issues or questions, please review the troubleshooting section or check the browser console for error messages.

---

**Last Updated**: March 2026
**Status**: Production Ready ✅
