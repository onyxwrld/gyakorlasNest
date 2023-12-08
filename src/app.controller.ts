import { Body, Controller, Delete, Get, Param, Post, Render, Res } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { adatokDTO } from './adatokDTO';
import { deleteDTO } from './deleteDTO';
import { Response } from 'express';

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'zeneDB',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok] = await conn.execute('SELECT id, cim, artist, length FROM zenek');
     return {
      zenek: adatok,
     }
    }
  @Get('/ujZene')
  @Render('ujZene')
  ujZeneForm() {

  }
  @Post('/ujZene')
  @Render('ujZene')
  async ujZene(@Body() ujZene: adatokDTO, @Res() res: Response){
    const title = ujZene.title;
    const aritst = ujZene.artist;
    const length = ujZene.length;
    const [adatok] = await conn.execute('INSERT INTO zenek (cim, artist, length) VALUES (?, ?, ?)',
    [title, aritst, length],);
    res.redirect('/ujZene')
  }
  @Post('/deleteMusic')
  async deleteMusic(@Body() mID:deleteDTO, @Res() res : Response) {
    const id = mID.id;
    console.log(id);
    const [adatok] = await conn.execute('DELETE FROM zenek WHERE id = ?',
    [id],);
    console.log(adatok);
    res.redirect('/');
  }
}
