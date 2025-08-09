import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import html from './templates/otp';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendOtpEmail(params: {
    to: string;
    code: string;
    expiresAt: Date;
  }): Promise<void> {
    // const templatePath = path.join(__dirname, 'templates', 'otp.html');
    // let html = fs.readFileSync(templatePath, 'utf-8');
    // html = `
    //   ${html
    //     .replace('{{OTP_CODE}}', params.code)
    //     .replace('{{EXPIRES_AT}}', params.expiresAt.toLocaleString())
    //     .replace('{{YEAR}}', new Date().getFullYear().toString())}
    // `;

    // const text = `Your verification code is ${params.code}. It expires at ${params.expiresAt.toLocaleString()}. If you did not request this, you can ignore this email.`;
    await this.mailer.sendMail({
      to: params.to,
      subject: 'Your verification code',
      html: html(
        params.code,
        params.expiresAt.toLocaleString(),
        new Date().getFullYear().toString(),
      ),
    });
  }
}
