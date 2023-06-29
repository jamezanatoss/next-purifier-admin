const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

router.post('/send-email', async (req, res) => {
  const { recipient, subject, content } = req.body;

  // Check if email and pass are defined
  if (!email || !pass) {
    return res.status(500).json({ error: 'Email credentials not found' });
  }

  const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
      user: email,
      pass: pass,
    },
  });

  // Create email message options
  const mailOptions = {
    from: email,
    to: recipient,
    subject,
    text: content,
  };

  console.log('mailOptions', mailOptions);
  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
