import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordService, JwtAuthGuard],
  exports: [JwtService, PasswordService, JwtAuthGuard],
})
export class AuthModule {}
