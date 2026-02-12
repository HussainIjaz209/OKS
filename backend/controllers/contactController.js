const nodemailer = require('nodemailer');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
    const { name, email, phone, studentClass, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please provide all required fields (name, email, subject, message).' });
    }

    try {
        // Create a transporter using environment variables
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.log('--- DEVELOPMENT MODE: Contact Form Submission ---');
            console.log('To enable actual emails, set EMAIL_USER and EMAIL_PASS in .env');
            console.log('Recipient:', 'salmanijazmanglor@gmail.com');
            console.log('Submission:', { name, email, phone, studentClass, subject, message });
            console.log('--------------------------------------------------');

            return res.status(200).json({
                message: 'Message received (Development Mode: Logged to console).',
                devMode: true
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Recommended to send via authenticated user
            replyTo: email, // So replies go to the sender
            to: 'salmanijazmanglor@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Student Class:</strong> ${studentClass || 'N/A'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>This email was sent from the OKS Management System Contact Form.</p>
            `,
            text: `
                New Contact Form Submission
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'N/A'}
                Student Class: ${studentClass || 'N/A'}
                Subject: ${subject}
                Message: ${message}
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);

        // If it's a configuration error (missing credentials), inform the developer but still return 200 in dev
        // OR return 500 if it's a real failure
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({
                message: 'Mail server not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.',
                error: error.message
            });
        }

        res.status(500).json({ message: 'Failed to send email. Please try again later.', error: error.message });
    }
};

module.exports = { sendContactEmail };
