const express = require('express')
const router = express.Router();

let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teammathtrials@gmail.com',
    pass: 'gjsz thnc thsj ryok'
  }
});

module.exports = function (db){
    router.get('/', async (req, res) => { // maybe list the email templates available?
        res.send("Emails!");
    });

    router.post('/password-reset', async (req, res) => { // send a password reset email
        //res.send("Sending password reset email...");
        const { email } = req.body;

        try {
            const usersCollection = db.collection('users');
            let user = "";

            try {
                user = await usersCollection.findOne({ email: email });
            } catch(err) {
                return res.status(400).json({ error: 'Email not found' });
            }

            let mail = {
                from: 'teammathtrials@gmail.com',
                to: email,
                subject: 'Account Password Reset',
                html: passwordResetHTML(user.username)
            };

            transporter.sendMail(mail, function(error, info){
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Something went wrong' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ message: 'Password reset email successfully sent!' });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });

    router.post('/registration-confirmation', async (req, res) => {
        const { email, username } = req.body;

        try {
            let mail = {
                from: 'teammathtrials@gmail.com',
                to: email,
                subject: 'Welcome to Math Trials! 🎉',
                html: registrationConfirmationHTML(username)
            };

            transporter.sendMail(mail, function(error, info) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Failed to send confirmation email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ message: 'Registration confirmation email sent successfully!' });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong sending the confirmation email' });
        }
    });

    return router;
}

function passwordResetHTML(username) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            background-color: '#f6f9fc';
            padding: '10px 0';
        }
        #container {
            background-color: '#ffffff';
            border: '1px solid #f0f0f0';
            padding: '45px';
        }

        p {
            font-size: '16px';
            font-family: "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif";
            font-weight: '300';
            color: '#404040';
            line-height: '26px';
        }

        button {
            background-color: '#c47f00ff';
            border-radius: '7px';
            color: '#fff';
            font-family: "'Open Sans', 'Helvetica Neue', Arial";
            font-size: '15px';
            text-decoration: 'none';
            text-align: 'center';
            display: 'block';
            width: '210px';
            padding: '14px 7px';
        }

        a {
            text-decoration: 'none';
        }
    </style>

  </head>
  <body>
    <div id="container">
        <Img src="https://i.imgur.com/tV4Kglg.png" width="50" alt="Math Trials"/>

        <div id="section">
            <p>Hi ${username} 👋</p>
            <p>We have received a request for a password change for your Math Trials account.
                If this is you, you can set a new password here:</p>
            
            <a href="http://localhost:5173/ConfirmPasswordReset" target="_blank"><button type="button">Reset Password</button></a>
            
            <p>If you don&apos;t want to change your password or didn&apos;t
              request to, feel free to ignore and delete this message.</p>
            <p>To keep your account secure, we recommend to not forward this email to anyone.</p>
            <p>Happy Trials 🏆</p>
        </div>
    </div>
  </body>
</html>`
}

function registrationConfirmationHTML(username) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body {
            background-color: '#f6f9fc';
            padding: '10px 0';
        }
        #container {
            background-color: '#ffffff';
            border: '1px solid #f0f0f0';
            padding: '45px';
        }
        p {
            font-size: '16px';
            font-family: "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif";
            font-weight: '300';
            color: '#404040';
            line-height: '26px';
        }
        button {
            background-color: '#c47f00ff';
            border-radius: '7px';
            color: '#fff';
            font-family: "'Open Sans', 'Helvetica Neue', Arial";
            font-size: '15px';
            text-decoration: 'none';
            text-align: 'center';
            display: 'block';
            width: '210px';
            padding: '14px 7px';
        }
        a {
            text-decoration: 'none';
        }
    </style>
  </head>
  <body>
    <div id="container">
        <Img src="https://i.imgur.com/tV4Kglg.png" width="50" alt="Math Trials"/>
        <div id="section">
            <p>Welcome to Math Trials, ${username}! 👋</p>
            <p>Thank you for joining our community of math enthusiasts. Your account has been successfully created.</p>
            
            <p>You can now:</p>
            <ul>
                <li>Play math games and earn points</li>
                <li>Track your progress on the leaderboard</li>
                <li>Challenge yourself with various math problems</li>
            </ul>
            
            <a href="http://localhost:5173/Sign-in" target="_blank">
                <button type="button">Start Playing Now</button>
            </a>
            
            <p>If you have any questions or need assistance, feel free to contact us.</p>
            <p>Happy Learning! </p>
            <p>The Math Trials Team</p>
        </div>
    </div>
  </body>
</html>`
}