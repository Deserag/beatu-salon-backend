import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  private _prisma = new PrismaClient();

  async signIn(signInDTO: SignInDTO): Promise<any> {
    const user = await this._prisma.user.findFirst({
      where: {
        OR: [
          { login: signInDTO.login },
          { email: signInDTO.login },
        ],
        AND: [
          { password: signInDTO.password },
        ]
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }



    return { accessToken: 'your_generated_token_here', user: { id: user.id, login: user.login, email: user.email } };
  }
}