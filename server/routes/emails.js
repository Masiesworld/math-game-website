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

    router.get('/password-reset', async (req, res) => { // maybe list the email templates available?
        //res.send("Sending password reset email...");
        const { email } = req.body;
        
        try {
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ email: email });

            let mail = {
                from: 'teammathtrials@gmail.com',
                to: email,
                subject: 'Account Password Reset',
                html: passwordResetHTML(user.username)
            };

            transporter.sendMail(mail, function(error, info){
                if (error) {
                    console.log(error);
                    res.send("Password Reset was not able to be sent: " + error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send("Password Reset email successfully sent: " + info.response);
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });

return router;
}

function passwordResetHTML(username) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="Macy Yu" content="Product Owner/Project Manager" />
    <meta name="Kyle Wostbrock" content="Frontend Developer (Development Team)" />
    <meta name="Rafael Hinchey" content="Scrum Master" />
    <meta name="Nicholas Lucky" content="Backend Developer (Development Team)" />
    <!--<link rel="icon" type="image/svg+xml" href="/logo.svg" />-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--<title>Math Trials</title>-->

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
            
            <a href="http://localhost:5173/" target="_blank"><button type="button">Reset Password</button></a>
            
            <p>If you don&apos;t want to change your password or didn&apos;t
              request to, feel free to ignore and delete this message.</p>
            <p>To keep your account secure, we recommend to not forward this email to anyone.</p>
            <p>Happy Trials 🏆</p>
        </div>
    </div>
  </body>
</html>`
}