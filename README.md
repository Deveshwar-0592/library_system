# Library Management System

A full-stack web application for managing library book inventory, user accounts, and checkout/return operations. Built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Student login/signup with secure password management
- **Admin Dashboard**: Administrative panel for managing users and books
- **Book Management**: Add, view, and manage library book inventory
- **Checkout System**: Students can borrow and return books with automatic tracking
- **User Profiles**: Students can create accounts and update personal information (phone, email, address, date of birth, blood group, etc.)
- **Checkout History**: Track borrowed books, return dates, and borrowing history
- **Responsive UI**: Mobile-friendly interface built with Bootstrap 4
- **Secure Sessions**: Cookie-based session management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, Bootstrap 4, jQuery
- **Middleware**: Body-parser, Cookie-parser, Mongoose

## Project Structure

```
library_system/
├── server.js              # Main server application
├── package.json           # Project dependencies
├── index.html             # Login portal
├── admin.html             # Admin dashboard
├── user.html              # User dashboard
├── profile.html           # User profile management
├── history.html           # Checkout history
├── style.css              # Custom styles
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js (v12 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Deveshwar-0592/library_system.git
cd library_system
```

2. Install dependencies:
```bash
npm install
```

3. Ensure MongoDB is running:
```bash
# If MongoDB is installed locally
mongod
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### For Students
1. Click on **"User Login"** tab
2. Create a new account with your username, student ID, and password
3. Fill in your personal details
4. Browse available books and checkout books
5. View your checkout history and manage returns

### For Administrators
1. Click on **"Admin Login"** tab
2. Login with admin credentials
3. Manage book inventory (add/remove books)
4. View all users and their checkout history
5. Monitor library statistics

## Default Admin Credentials

The system automatically creates default admin accounts on first run. Check the console for initial credentials or modify the `seedAdmins()` function in `server.js`.

## API Endpoints

The application uses Express routes to handle:
- User authentication (login/signup)
- Book management (add, view, update, delete)
- Checkout operations (borrow, return books)
- User profile management
- History tracking

## Database Schema

- **Books**: Book name, Author name
- **Users**: Full name, Username, Student ID, Department, Password, Contact info, Address, DOB, Blood Group
- **Checkout Records**: User, Book, Borrow date, Return date, Return status
- **Admins**: Full name, Password

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact & Support

For questions or issues, please open an issue on the GitHub repository or contact the project maintainer.

---

**Version**: 1.0.0  
**Last Updated**: May 2026
