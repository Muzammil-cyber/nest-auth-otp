const html = (otp, expire, year) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 500px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .header {
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 22px;
        }

        .content {
            padding: 30px;
            text-align: center;
        }

        .otp {
            display: inline-block;
            font-size: 28px;
            font-weight: bold;
            color: #2E7D32;
            background: #e8f5e9;
            padding: 12px 25px;
            border-radius: 6px;
            letter-spacing: 4px;
            margin: 20px 0;
        }

        .expires {
            margin-top: 10px;
            font-size: 14px;
            color: #555;
        }

        .footer {
            background: #f9f9f9;
            padding: 15px;
            font-size: 12px;
            text-align: center;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Your Verification Code</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to verify your email. Use the OTP below to complete the process.</p>
            <div class="otp">${otp}</div>
            <p class="expires">This code will expire at <strong>${expire}</strong> (5 minutes from now).</p>
            <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            &copy; ${year} Your Company. All rights reserved.
        </div>
    </div>
</body>

</html>`;

export default html;
