import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody } from '@/common/zod-pipe';
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  type ChangePasswordInput,
  type LoginInput,
  type LogoutInput,
  type RefreshInput,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from './jwt-auth.guard';

interface AuthedRequest extends FastifyRequest {
  user: { id: string; tenantId: string; role: string; jti: string };
  correlationId?: string;
}

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body(ZodBody(loginSchema)) body: LoginInput, @Req() req: FastifyRequest) {
    const { tokens, user } = await this.auth.login(body.tenantSlug, body.email, body.password, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });
    return {
      ...tokens,
      user: { id: user.id, tenantId: user.tenantId, role: user.role, email: user.email, fullName: user.fullName },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body(ZodBody(refreshSchema)) body: RefreshInput, @Req() req: FastifyRequest) {
    return this.auth.refresh(body.refreshToken, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body(ZodBody(logoutSchema)) body: LogoutInput, @Req() req: AuthedRequest) {
    await this.auth.logout(body.refreshToken, req.user.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });
  }

  @Post('change-password')
  @HttpCode(204)
  async changePassword(@Body(ZodBody(changePasswordSchema)) body: ChangePasswordInput, @Req() req: AuthedRequest) {
    await this.auth.changePassword(req.user.id, body.currentPassword, body.newPassword, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });
  }

  @Get('me')
  async me(@Req() req: AuthedRequest) {
    return { id: req.user.id, tenantId: req.user.tenantId, role: req.user.role };
  }
}
