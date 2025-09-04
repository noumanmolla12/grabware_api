const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./db/database'); // MongoDB connection


const headerRoutes = require('./routes/headerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/EventRoutes');
const implinkRoutes = require('./routes/ImpLinkRoutes');
const navbarRoutes = require('./routes/navbarRoutes');
const MemberRoutes = require('./routes/MemberRoutes');
const OrderCircularRoutes = require('./routes/OrderCircularRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');




const app = express();

// ✅ CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// ✅ Built-in body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes

app.use('/api/headers', headerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/implinks', implinkRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/members', MemberRoutes);
app.use('/api/ordercircular', OrderCircularRoutes);
app.use('/api/notifications', NotificationRoutes);




// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
