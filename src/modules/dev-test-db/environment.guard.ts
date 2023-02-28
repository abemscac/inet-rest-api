import { CanActivate, Injectable, NotFoundException } from '@nestjs/common'
import { ProcessEnvironment } from '../../utils/env.util'

@Injectable()
export class EnvironmentGuard implements CanActivate {
  private readonly environments: ProcessEnvironment[]

  constructor(...environments: ProcessEnvironment[]) {
    this.environments = environments
  }

  canActivate(): boolean {
    const environment = process.env.NODE_ENV as ProcessEnvironment
    if (this.environments.includes(environment)) {
      return true
    }
    throw new NotFoundException()
  }
}
