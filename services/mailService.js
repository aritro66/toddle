const nodemailer = require("nodemailer");

async function sendmail(email, teacherName, studentName) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.AUTHUSER}`, // auth user gmail
        pass: `${process.env.AUTHPASSWORD}`, // auth user password
      },
    });

    const mailOptions = {
      to: email,
      subject: "Tagged for journal",
      text: `Hi ${studentName}, You have been tagged for journal by ${teacherName}. You can view the journal by after publish date.\n\nThanks\n`,
    };

    const info = await transporter.sendMail(mailOptions);
    // sending otp by mail
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendmail };
