import { Router, Request, Response } from "express";
import nodemailer from 'nodemailer';
import multer from "multer";
import multerConfig from '../config/multer';
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
require('dotenv').config()

const router = Router();
const upload = multer(multerConfig)


router.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'Hello World'});
})

router.post('/api/send-email', upload.array('files', 10), async (request: Request, response: Response) => {
    const { Subject, Content, Attachments, To, CC, CCo } = JSON.parse(request.body.request)

    console.log(`Subject: ${Subject}`)
    console.log(`Content: ${Content}`)

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
    } as SMTPTransport.Options)

    const listaDeArquivos: Mail.Attachment[] = [];

    Attachments.forEach((item: string[]) => {
        listaDeArquivos.push({
            filename: item[0],
            content: item[1],
            encoding: 'base64'
        })
    })

    const to = To.Email;
    const cc = CC.map((c:any) => c.Email).join(';');
    const bcc = CCo.map((c:any) => c.Email).join(';');

    let info = await transporter.sendMail({
        from: '"MailService" <mail.service@domain.com>',
        to,
        cc,
        bcc,
        subject: Subject,
        text: Content.replace(/<[^>]*>?/gm, ''),
        html: Content,
        attachments: listaDeArquivos
    });

    console.log(`Message sent: ${info.messageId}`);

    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return response.json({ messageId: info.messageId });
});

export default router;