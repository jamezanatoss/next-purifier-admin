const nodemailer = require('nodemailer');

const email = process.env.EMAIL;
const appPassword = process.env.APP_PASSWORD;

async function sendEmail(req, res) {
  const { recipient, subject, content } = req.body;

  if (!email || !appPassword) {
    return res.status(500).json({ error: 'Email credentials not found' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: email,
    to: recipient,
    subject,
    text: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', errorMessage: error.message });
  }
}

module.exports = sendEmail;



