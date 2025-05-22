# Health Application

A comprehensive health monitoring and prediction system that combines modern web technologies with machine learning capabilities to provide personalized health insights and predictions.

## 🌟 Features

- **User Authentication & Profile Management**
  - Secure user registration and login
  - Profile management with health metrics tracking
  - Role-based access control

- **Health Monitoring**
  - Real-time health metrics tracking
  - Historical data visualization
  - Customizable health goals and targets

- **Machine Learning Predictions**
  - Advanced health predictions using ML models
  - Personalized health insights
  - Risk assessment and recommendations

- **Modern User Interface**
  - Responsive design for all devices
  - Intuitive navigation
  - Real-time data updates

## 🏗️ Project Structure

The project is organized into three main components:

### Frontend (`/Frontend`)
- Built with React and Vite
- Modern UI components
- Responsive design
- State management
- API integration

### Backend (`/Backend`)
- Node.js/Express server
- MongoDB database integration
- RESTful API endpoints
- Authentication middleware
- File upload handling
- Data processing and validation

### Machine Learning (`/ML`)
- Python-based ML models
- Health prediction algorithms
- Data processing pipelines
- Model training and evaluation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd HealthApp-Version2
   ```

2. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd Backend
   npm install
   npm start
   ```

4. **ML Setup**
   ```bash
   cd ML
   pip install -r requirements.txt
   ```

### Environment Variables

Create `.env` files in both Frontend and Backend directories with the following variables:

**Backend/.env**
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

## 🛠️ Technologies Used

- **Frontend**
  - React
  - Vite
  - Modern CSS frameworks
  - Chart.js for data visualization

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Django

- **Machine Learning**
  - Python
  - Scikit-learn
  - Pandas
  - NumPy

## 📝 API Documentation

The backend provides the following API endpoints:

### Public Routes (No Authentication Required)
- `POST /signin` - User sign in
- `POST /signup` - User registration
- `GET /` - Health check endpoint
- `GET /nutrient` - Get nutrient information
- `GET /exercise` - Get exercise information
- `POST /chatbot` - Health assistant chatbot endpoint

### Protected Routes (Authentication Required)
- `GET /getLast7DaysData` - Retrieve user's health data from the last 7 days
- `POST /addOrUpdateUserData` - Add or update user's health data

All protected routes require a valid JWT token in the Authorization header.

> **Security Note**: For security reasons, specific API endpoint URLs and implementation details are not publicly disclosed. Developers can contact me @vishalsrinivasancontact@gmail.com to get more information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Vishal Srinivasan

## 🙏 Acknowledgments

- Special thanks to the open-source community
- Inspiration from modern health monitoring systems

## 📞 Support

For support, email [vishalsrinivasancontact@gmail.com] or open an issue in the repository. 