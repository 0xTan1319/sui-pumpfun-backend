const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: "",
        pass: "",
    },
});

const sendMail = async (email, content, subject = "From Mad") => {
    try {
        const mailOptions = {
            from: "", // sender address
            to: `${email}`,
            subject: subject, // Subject line
            html: `
                    ${content}
                `,
        };
        await smtpTransport.sendMail(mailOptions);
        return { success: true, message: "success" };
    } catch (err) {
        return { success: false, message: err };
    }
};

module.exports = {
    sendMail,
};
