import { createTransport } from 'nodemailer';
import { smtp_host, smtp_pass, smtp_port, smtp_user } from '../config.js';

// Create a transporter object using the default SMTP transport
const transporter = createTransport({
  host: smtp_host, // Hostinger SMTP server
  port: smtp_port, // Port for sending mail
  secure: true, // Use SSL (false for TLS)
  auth: {
    user: smtp_user, // Your email address
    pass: smtp_pass, 
  },
});


export function sendAlertMail({ subject, text, to, html }){
  const mailOptions = {
    from: smtp_user, // Sender address
    to: to, // Recipient address
    subject: subject,
    text: text,
    html: html
  };
  
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
