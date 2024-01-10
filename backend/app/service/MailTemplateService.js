const structureTemplate = (body) => {
    return `<!doctype html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    </head>
                    <body>
                        ${body}
                    </body>
                </html>`
};
const MailTemplate = {
    processPlaceholder: (stringWithPlaceholders, replacements) => {
        return stringWithPlaceholders.replace(
            /{(\w+)}/g,
            (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                replacements.hasOwnProperty(placeholderWithoutDelimiters) ?
                    replacements[placeholderWithoutDelimiters] : placeholderWithDelimiters
        );

    },
    activationTemplate: {
        subject: process.env.APP_NAME+': Activation code',
        body: structureTemplate(`<p> Hello {name},<br /><br /></p>
                <p> Here is your account activation code  </p>
                <h1>{activationCode}</h1>
               
                <br><br>
                Regards
                <br>
                tketch Support`)
    },
    forgotPasswordTemplate: {
        subject: process.env.APP_NAME+': Password Reset code',
        body: structureTemplate(`<p> Hello {name},<br /><br /></p>
                <p> Here is your password reset code.  </p>
                <h1>{resetCode}</h1>
            
                <br><br>
                Regards
                <br>
                tketch Support`)
    },
}
module.exports = MailTemplate