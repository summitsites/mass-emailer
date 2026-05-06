import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Verify credentials endpoint
app.post('/api/verify', async (req, res) => {
    const { user, pass } = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    try {
        await transporter.verify();
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
});

// Send single email endpoint
app.post('/api/send', async (req, res) => {
    const { user, pass, to, subject, body } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    try {
        await transporter.sendMail({
            from: user,
            to: to,
            subject: subject,
            text: body
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, async () => {
    console.log(`UI Server running at http://localhost:${PORT}`);
    console.log(`Opening browser...`);
    // Automatically open the UI in the default browser
    await open(`http://localhost:${PORT}`);
});
