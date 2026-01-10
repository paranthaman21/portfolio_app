export default function handler(req, res) {
  // Set CORS headers to allow requests from anywhere (or restrict to your specific domain)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Integrate with an email service (e.g., SendGrid, Nodemailer) or database here.
    // Example: await sendEmail({ to: 'vbarath210706@gmail.com', subject: `New Message from ${name}`, text: message });

    console.log('Form submission received:', { name, email, message });

    // Return success response
    return res.status(200).json({ success: true, message: 'Message sent successfully! Thank you for contacting me.' });
  }

  // Handle any other HTTP method
  return res.status(405).json({ error: 'Method Not Allowed' });
}
