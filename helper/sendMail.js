const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
    }
});

exports.sendMail = async (receiver) => {
    try {
        await transport.sendMail(receiver);
        console.log("Email sent:", receiver);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
};









// const Sib = require('sib-api-v3-sdk')
// const client = Sib.ApiClient.instance
// const apiKey = client.authentications['api-key']
// apiKey.apiKey = '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'

// exports.sendVerificationLink = function sendEmail(recipientEmail, recipientName, token) {
//     const tranEmailApi = new Sib.TransactionalEmailsApi()
//     const sender = {
//         email: 'kmanishk970@gmail.com',
//         name: 'Manish Kumar',
//     }
//     const receiver = [
//         {
//             email: recipientEmail
//         },
//     ]
//     tranEmailApi.sendTransacEmail({
//         sender,
//         to: receiver,
//         subject: 'Verify Your Account',
//         htmlContent: `
    // <p>Hi ${recipientName},</p>
    // <p>Please click on the following link to verify your account:</p>
    // <p><a href="http://192.168.1.54:9000/user/verifyEmail/${token}">Verify Email</a></p>
// `,
// //     })
// //         .then(console.log)
// //         .catch(console.log)
// //     return token
// // };












// const SibApiV3Sdk = require('sib-api-v3-sdk');

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';
// console.log("email sent");
// async function sendVerificationLink(recipientEmail, recipientName, token) {

    
//     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//     const sender = { email: 'kmanishk970@gmail.com', name: 'Manish KUmar' };
//     const to = [{ email: recipientEmail, name: recipientName }];
//     const subject = 'Verify Your Account';
//     const htmlContent = `
//     <p>Hi ${recipientName},</p>
//     <p>Please click on the following link to verify your account:</p>
//     <p><a href="http://192.168.1.54:9000/user/verifyEmail/${token}">Verify Email</a></p>
// `;
//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//     sendSmtpEmail.sender = sender;
//     sendSmtpEmail.to = to;
//     sendSmtpEmail.subject = subject;
//     sendSmtpEmail.htmlContent = htmlContent;

//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log('Email sent successfully:', response);

// }

// module.exports = sendVerificationLink;





