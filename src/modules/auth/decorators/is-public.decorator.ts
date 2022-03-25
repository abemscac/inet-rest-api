import { SetMetadata } from '@nestjs/common'

export const IsPublicMetadataSymbol = Symbol('isPublic')

export const IsPublic = () => SetMetadata(IsPublicMetadataSymbol, true)
