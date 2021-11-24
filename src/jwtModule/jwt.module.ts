import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXPIREIN,
      },
    }),
  ],
  exports: [JwtModule],
})
export class JsonWebTokenModule {}
