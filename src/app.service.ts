import { Injectable } from '@nestjs/common'

export interface IAppService {
  getVersion(): string
}

@Injectable()
export class AppService implements IAppService {
  getVersion(): string {
    const { npm_package_name, npm_package_version } = process.env
    return `${npm_package_name} ${npm_package_version}`
  }
}
