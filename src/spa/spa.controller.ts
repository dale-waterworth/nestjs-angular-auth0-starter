import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

@Controller()
export class SpaController {
  @Get('*')
  serveSpa(@Req() req: Request, @Res() res: Response): void {
    // Don't handle API routes
    if (req.path.startsWith('/api')) {
      return;
    }

    // Don't handle static assets (js, css, ico, etc.)
    if (req.path.match(/\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
      return;
    }

    res.sendFile(join(__dirname, '..', '..', 'public', 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  }
}