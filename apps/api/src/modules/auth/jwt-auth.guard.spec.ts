import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const context = (authorization?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: { authorization } }),
    }),
  }) as unknown as ExecutionContext;

  it('accepts a valid bearer token and attaches verified claims', async () => {
    const jwtService = { verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-1', businessId: 'business-1' }) } as any;
    const guard = new JwtAuthGuard(jwtService);
    const request = { headers: { authorization: 'Bearer token' } };
    const ctx = { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token');
    expect(request).toHaveProperty('user.sub', 'user-1');
  });

  it('rejects a missing bearer token', async () => {
    const guard = new JwtAuthGuard({ verifyAsync: jest.fn() } as any);
    await expect(guard.canActivate(context())).rejects.toThrow('Authentication required');
  });

  it('rejects an invalid token', async () => {
    const jwtService = { verifyAsync: jest.fn().mockRejectedValue(new Error('bad signature')) } as any;
    const guard = new JwtAuthGuard(jwtService);
    await expect(guard.canActivate(context('Bearer bad-token'))).rejects.toThrow('Invalid authentication token');
  });

  it('rejects a token without a subject claim', async () => {
    const jwtService = { verifyAsync: jest.fn().mockResolvedValue({ email: 'user@example.com' }) } as any;
    const guard = new JwtAuthGuard(jwtService);
    await expect(guard.canActivate(context('Bearer token'))).rejects.toThrow('Invalid authentication token');
  });
});
