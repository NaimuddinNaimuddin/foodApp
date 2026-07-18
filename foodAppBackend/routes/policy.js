const express = require("express");
const router = express.Router();
const rateLimiter = require("../common/rateLimiter");
const EFFECTIVE_DATE = process.env.EFFECTIVE_DATE || "19 July 2026";

router.get("/privacy-policy", rateLimiter(1000 * 60, 30), (req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
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
  res.set("Cache-Control", "public, max-age=3600");
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
    </html>`);
});

router.get("/refund-policy", rateLimiter(1000 * 60, 30), (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Refund & Return Policy</title>
<style>
body{
    font-family: Arial, Helvetica, sans-serif;
    line-height:1.7;
    max-width:900px;
    margin:40px auto;
    padding:20px;
    color:#333;
    background:#f8f8f8;
}
.container{
    background:#fff;
    padding:30px;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
}
h1,h2{
    color:#1a1a1a;
}
ul{
    padding-left:20px;
}
li{
    margin-bottom:8px;
}
</style>
</head>
<body>
<div class="container">
<h1>Refund & Return Policy</h1>
<p><strong>Effective Date:</strong>  ${EFFECTIVE_DATE}</p>
<p>
Thank you for choosing our grocery delivery service. We are committed to delivering fresh,
high-quality products. If you experience any issue with your order, please review our policy below.
</p>
<h2>1. Order Cancellation</h2>
<ul>
<li>Orders may be cancelled before they are packed.</li>
<li>Once an order has been packed or dispatched, cancellation may not be possible.</li>
<li>Approved cancellations will receive a full refund.</li>
</ul>
<h2>2. Returns</h2>
<p>
Due to the perishable nature of groceries, returns are generally not accepted after delivery.
</p>
<p>Exceptions include:</p>
<ul>
<li>Wrong item delivered.</li>
<li>Damaged product.</li>
<li>Expired product.</li>
<li>Missing item.</li>
</ul>
<h2>3. Refund Eligibility</h2>
<p>You may receive a refund if:</p>
<ul>
<li>You receive damaged or spoiled products.</li>
<li>The delivered item is different from your order.</li>
<li>An item is missing.</li>
<li>A paid item is unavailable and cannot be substituted.</li>
</ul>
<p>
Refund requests should be submitted within <strong>24 hours</strong> of delivery.
</p>
<h2>4. Non-Refundable Cases</h2>
<ul>
<li>Incorrect delivery address provided.</li>
<li>Customer unavailable at delivery.</li>
<li>Opened or consumed products unless defective.</li>
<li>Change of mind after delivery.</li>
<li>Minor packaging or appearance variations.</li>
</ul>
<h2>5. Refund Process</h2>
<ol>
<li>Contact customer support with your Order ID.</li>
<li>Share photos if requested.</li>
<li>Our team will review your request.</li>
<li>Approved refunds are processed within <strong>5–7 business days</strong>.</li>
</ol>
<h2>6. Replacement Policy</h2>
<p>
Where stock is available, we may replace damaged, missing or incorrect items instead of issuing a refund.
</p>
<h2>7. Quality Issues</h2>
<p>
If you believe a product is not fresh or is of poor quality,
please contact us within 24 hours of delivery.
</p>
<h2>8. Contact Us</h2>
<p>Please include:</p>
<ul>
<li>Order ID</li>
<li>Product details</li>
<li>Description of the issue</li>
<li>Photos (if applicable)</li>
</ul>
<h2>9. Policy Updates</h2>
<p>
We reserve the right to modify this Refund & Return Policy at any time.
Updates become effective immediately upon publication.
</p>
</div>
</body>
</html>
`);
});

router.get('/', rateLimiter(1000 * 60, 30), (req, res) => {
  res.send(`Hello Food App.`)
})

module.exports = router;
