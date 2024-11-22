import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailServiceService {
  private sendGridApiKey = '';

  constructor(private readonly configService: ConfigService) {
    this.sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    sgMail.setApiKey(this.sendGridApiKey);
  }

  async sendEmail(to: string, subject: string, text: string) {
    const msg = {
      to,
      from: 'vats.2610@gmail.com',
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  //   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // const msg = {
  //   to: 'test@example.com', // Change to your recipient
  //   from: 'test@example.com', // Change to your verified sender
  //   subject: 'Sending with SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // }
  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     console.log('Email sent')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
}
