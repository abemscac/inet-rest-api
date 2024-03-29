import { InternalServerErrorException } from '@nestjs/common'
import * as FormData from 'form-data'
import fetch from 'node-fetch'
import { getAppConfig } from '~/app.config'
import { isDevelopment, isTest } from './env.util'

export interface IImgurUtil {
  oauth: IImgurUtilOAuth
  getExtFromLink(link: string): string
  toLink(metadata: IImageMetadata): string | null
}

export interface IImgurUtilOAuth {
  /**
   * This method can only be called 1 time.
   */
  init(): void
  getAccessToken(): Promise<string>
}

interface IImageMetadata {
  hash?: string | null
  ext?: string | null
  size: ImageSize
}

export enum ImageSize {
  Original = '',
  /**
   * 90x90
   */
  SmallSquare = 's',
  /**
   * 160x160
   */
  BigSquare = 'b',
  /**
   * 160xAUTO, won't be larger than original size.
   */
  SmallThumbnail = 't',
  /**
   * 320xAUTO, won't be larger than original size.
   */
  MediumThumbnail = 'm',
  /**
   * 640xAUTO, won't be larger than original size.
   */
  LargeThumbnail = 'l',
  /**
   * 1024xAUTO, won't be larger than original size.
   */
  HugeThumbnail = 'h',
}

class ImgurUtilOAuth implements IImgurUtilOAuth {
  private generateAccessTokenPromise: Promise<string> | null
  private initialized = false

  init(): void {
    if (this.initialized) {
      throw new InternalServerErrorException(
        'Attempt to initialize ImgurUtilOAuth multiple times.',
      )
    }
    this.initialized = true
    this._generateAccessToken()
    this.setRefreshTimer()
  }

  getAccessToken(): Promise<string> {
    this.checkInitialization()
    if (this.generateAccessTokenPromise) {
      return this.generateAccessTokenPromise
    } else {
      return this._generateAccessToken()
    }
  }

  private checkInitialization(): void {
    if (!this.initialized) {
      throw new InternalServerErrorException(
        "Attempt to get imgur access token before initialization. Please call 'init' method first.",
      )
    }
  }

  private _generateAccessToken(): Promise<string> {
    this.checkInitialization()
    const {
      accessTokenUrl,
      clientId,
      clientSecret,
      refreshToken,
      ACCESS_TOKEN_DEV,
    } = getAppConfig().imgur.oauth

    if (isDevelopment() || isTest()) {
      this.generateAccessTokenPromise = new Promise((resolve) => {
        return resolve(ACCESS_TOKEN_DEV)
      })
    } else {
      const formData = new FormData()
      formData.append('refresh_token', refreshToken)
      formData.append('client_id', clientId)
      formData.append('client_secret', clientSecret)
      formData.append('grant_type', 'refresh_token')

      this.generateAccessTokenPromise = fetch(accessTokenUrl, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      })
        .then(async (response) => {
          const data =
            (await response.json()) as IImgurGenerateAccessTokenResponseModel
          return data.access_token
        })
        .catch((error) => {
          this.generateAccessTokenPromise = null
          throw error
        })
    }

    return this.generateAccessTokenPromise
  }

  private setRefreshTimer() {
    const MS_ONE_DAY = 60 * 60 * 24 * 1000
    /**
     * According to the official document of Imgur, the token expires after a month.
     * So we can refresh it 3 days before it expires.
     * @see https://apidocs.imgur.com/#intro
     */
    const TOKEN_REFRESH_INTERVAL_DAYS = 27

    let days = 0
    setTimeout(() => {
      if (days++ >= TOKEN_REFRESH_INTERVAL_DAYS) {
        this._generateAccessToken()
        days = 0
      }
    }, MS_ONE_DAY)
  }
}

export const ImgurUtil: IImgurUtil = {
  oauth: new ImgurUtilOAuth(),
  getExtFromLink(link: string): string {
    const array = link.split('.')
    return array[array.length - 1]
  },
  toLink(metadata: IImageMetadata): string | null {
    const { hash, ext, size } = metadata
    if (!hash || !ext) {
      return null
    }
    return `https://i.imgur.com/${hash}${size}.${ext}`
  },
}

interface IImgurGenerateAccessTokenResponseModel {
  access_token: string
  expired_in: number
  token_type: string
  scope: string | null
  refresh_token: string
  account_id: number
  account_username: string
}
