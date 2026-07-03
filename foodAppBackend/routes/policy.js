const express = require("express");
const router = express.Router();
const rateLimiter = require("../common/rateLimiter");

router.get("/privacy-policy", rateLimiter(1000 * 60, 30), (req, res) => {
  res.send(`
  <html>
    <head>
      <title>Privacy Policy</title>
    </head>
    <body>
      <h1>Privacy Policy</h1>

      <p>We respect your privacy and are committed to protecting your personal data.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Name, email, and login credentials</li>
        <li>Order and cart details</li>
        <li>Device information</li>
        <li>Usage data</li>
      </ul>

      <h2>How We Use Information</h2>
      <ul>
        <li>To provide and improve our services</li>
        <li>To process orders</li>
        <li>To manage user accounts</li>
      </ul>

      <h2>Data Storage</h2>
      <p>Your data is securely stored in our database and protected using standard security practices.</p>

      <h2>Data Sharing</h2>
      <p>We do not sell or share personal data with third parties except required services.</p>

      <h2>Security</h2>
      <p>We use secure methods like encryption and authentication to protect your data.</p>

      <h2>Contact Us</h2>
      <p>Email: support@yourapp.com</p>

    </body>
  </html>
  `);
});

router.get("/terms", rateLimiter(1000 * 60, 30), (req, res) => {
  res.send(`
  <html>
    <head>
      <title>Terms & Conditions</title>
    </head>
    <body>
      <h1>Terms & Conditions</h1>

      <h2>Usage Rules</h2>
      <p>You agree to use this app only for lawful purposes.</p>

      <h2>User Accounts</h2>
      <p>You are responsible for maintaining your account security.</p>

      <h2>Service Changes</h2>
      <p>We may update or modify the app at any time.</p>

      <h2>Orders</h2>
      <p>All orders are subject to availability and confirmation.</p>

      <h2>Termination</h2>
      <p>We may suspend accounts violating our policies.</p>

      <h2>Contact</h2>
      <p>Email: support@yourapp.com</p>

    </body>
  </html>
  `);
});

router.get('/', rateLimiter(1000 * 60, 30), (req, res) => {
  res.send(`Hello Food App.`)
})

module.exports = router;
