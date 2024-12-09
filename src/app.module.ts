import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  ClientModule,
  RecordModule,
  UserModule,
  OfficeModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ClientModule,
    RecordModule,
    AuthModule,
    OfficeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
