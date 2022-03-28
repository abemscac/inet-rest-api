import { ApiConsumes } from '@nestjs/swagger'

export const ApiMultipart = () => ApiConsumes('multipart/data')
