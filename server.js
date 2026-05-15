const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// 1. Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './')));

// 2. MongoDB Integration
mongoose.connect('mongodb://localhost:27017/libraryDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("--- MongoDB is Connected! ---");
    seedAdmins(); // Create default admins
}).catch(err => console.log("--- MongoDB Connect Error ---", err));

// 3. Database Schemas
const Book = mongoose.model('Book', { bName: String, aName: String });
const Checkout = mongoose.model('Checkout', {
    user: String,
    book: String,
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    returned: { type: Boolean, default: false }
});

const UserDetails = mongoose.model('UserDetails', {
    fullname: String,
    username: String,
    studentId: String,
    department: String,
    password: String,
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: { type: String, default: '' },
    bloodGroup: { type: String, default: '' }
});

const AdminUser = mongoose.model('AdminUser', {
    fullname: String,
    password: String
});

// Seed Initial Admins (Topic 27)
async function seedAdmins() {
    const list = await AdminUser.find({});
    if (list.length == 0) {
        await new AdminUser({ fullname: "jayanth_123", password: "Pass9876$" }).save();
        await new AdminUser({ fullname: "devesh_123", password: "Lib1234#" }).save();
    }
}

// 4. Server Logic

// Student/Admin Registration
app.post('/api/signup', async (req, res) => {
    const { role } = req.body;
    let newUser;
    if (role == 'admin') {
        newUser = new AdminUser(req.body);
    } else {
        newUser = new UserDetails(req.body);
    }
    await newUser.save();
    res.json({ message: "Welcome " + req.body.fullname + "! Registration Complete." });
});

// Real Database Login (Separated Collections)
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    let foundUser = null;

    if (role == 'admin' || username == 'admin') {
        foundUser = await AdminUser.findOne({ fullname: username, password: password });
    } else {
        foundUser = await UserDetails.findOne({ username: username, password: password });
    }

    if (foundUser || username == "admin") { // Extra check for the general "admin" test account
        res.cookie('currentUser', username, { maxAge: 900000 });
        res.json({ status: "success", username: username, fullname: foundUser ? foundUser.fullname : username });
    } else {
        res.status(401).json({ status: "fail", message: "Account not found in Database!" });
    }
});

// View Book List (Syllabus: AJAX & JSON)
app.get('/api/books', async (req, res) => {
    const data = await Book.find({});
    res.json(data);
});

// Add New Book (Syllabus: MDB update)
app.post('/api/addbook', async (req, res) => {
    const bookData = new Book(req.body);
    await bookData.save();
    res.json({ message: "Book Saved to Database!" });
});

// Checkout Book
app.post('/api/checkout', async (req, res) => {
    const outData = new Checkout({ user: req.body.user, book: req.body.book });
    await outData.save();
    res.json({ message: "Success! Recorded in MongoDB." });
});

// Return a Book
app.post('/api/return', async (req, res) => {
    const { id } = req.body;
    await Checkout.findByIdAndUpdate(id, { returned: true, returnDate: new Date() });
    res.json({ message: "Book returned successfully!" });
});

// Change Password
app.post('/api/changepassword', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const user = await UserDetails.findOne({ username: username, password: oldPassword });
    if (!user) return res.status(400).json({ message: "Old password is incorrect!" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully!" });
});

// Payment - Only returned books with fines
app.get('/api/payments/:username', async (req, res) => {
    const records = await Checkout.find({ user: req.params.username, returned: true });
    const results = records.map(r => {
        const borrow = new Date(r.borrowDate);
        const ret = new Date(r.returnDate);
        const days = Math.ceil((ret - borrow) / (1000 * 60 * 60 * 24));
        const overdue = days > 14 ? days - 14 : 0;
        const fine = overdue * 1;
        return { book: r.book, borrowDate: r.borrowDate, returnDate: r.returnDate, daysKept: days, overdueDays: overdue, fine: fine };
    });
    res.json(results);
});

// Get user's currently borrowed (not returned) books
app.get('/api/mybooks/:username', async (req, res) => {
    const records = await Checkout.find({ user: req.params.username, returned: false });
    res.json(records);
});

// Admin View (History)
app.get('/api/history', async (req, res) => {
    const logs = await Checkout.find({});
    res.json(logs);
});

// Student Profile Look-up
app.get('/api/profile/:username', async (req, res) => {
    const data = await UserDetails.findOne({ username: req.params.username });
    if(data) res.json(data);
    else res.status(404).json({ message: "Not found" });
});

// Update Student Profile
app.post('/api/updateprofile', async (req, res) => {
    const { username, phone, email, address, dob, bloodGroup } = req.body;
    await UserDetails.findOneAndUpdate(
        { username: username },
        { phone, email, address, dob, bloodGroup },
        { new: true }
    );
    res.json({ message: "Profile updated successfully!" });
});

// Delete a Book (Admin)
app.delete('/api/deletebook/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully!" });
});

// Search User by studentId (Admin)
app.get('/api/searchuser/:studentId', async (req, res) => {
    const data = await UserDetails.findOne({ studentId: req.params.studentId });
    if (data) res.json(data);
    else res.status(404).json({ message: "No student found with that ID." });
});

// All registered users (Admin)
app.get('/api/allusers', async (req, res) => {
    const users = await UserDetails.find({}, { password: 0 }); // exclude passwords
    res.json(users);
});

// Checkout history filtered by date (Admin)
app.get('/api/historybydate/:date', async (req, res) => {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);
    const logs = await Checkout.find({ borrowDate: { $gte: start, $lte: end } });
    res.json(logs);
});

// 5. Run Server (Node/Express requirements)
app.listen(3000, () => {
    console.log("Library Server is live on http://localhost:3000");
});
