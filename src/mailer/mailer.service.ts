import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }

  async confirmEmail(userEmail: string) {
    const transport = await this.transporter();
    await transport.sendMail({
      from: 'kilandaherve@gmail.com',
      to: userEmail,
      subject: 'inscription',
      html: '<h3>Confirmation de votre inscription</h3>',
    });
  }
  async resetPassword(userEmail: string, url : string, code : string){
      const transport = await this.transporter();
      await transport.sendMail({
        from: 'kilandaherve@gmail.com',
        to: userEmail,
        subject: 'reset-password',
        html: 
          `
          <a href="${url}">Renouvelez votre mot de passe</a><br/><br/>
          <p>Secret code <strong>${code}</strong></p>
          <p>Le code va expiré dans 15 minutes</p>

          `
      });
  }
}
