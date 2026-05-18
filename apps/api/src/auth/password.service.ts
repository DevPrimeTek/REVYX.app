import { Injectable } from '@nestjs/common';
import { hash, verify, Algorithm } from '@node-rs/argon2';

@Injectable()
export class PasswordService {
  // OWASP-recommended argon2id parameters (memory=64MB, time=3, parallelism=1).
  private readonly opts = {
    algorithm: Algorithm.Argon2id,
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 1,
  };

  hash(plain: string): Promise<string> {
    return hash(plain, this.opts);
  }

  verify(plain: string, encoded: string): Promise<boolean> {
    return verify(encoded, plain);
  }
}
