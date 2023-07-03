const express = require('express');
const sendEmailRouter = require('./sendEmail');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/sendEmail', sendEmailRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
