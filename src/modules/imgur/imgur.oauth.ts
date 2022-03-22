import * as FormData from 'form-data'
import { IImgurGenerateAccessTokenResponseModel } from './models/i-imgur-generate-access-token-response.model'
import { fetch } from 'src/utils/fetch.util'

const MS_ONE_DAY = 60 * 60 * 24 * 1000
/**
 * AccessToken expires after a month, according to the official document.
 * @see https://apidocs.imgur.com/#intro
 */
const TOKEN_EXPIRATION = 30 * MS_ONE_DAY
/**
 * Refresh AccessToken three days before its' expiration date.
 */
const TOKEN_REFRESH_INTERVAL = TOKEN_EXPIRATION - 3 * MS_ONE_DAY

export interface IImgurOAuth {
  getAccessToken(): Promise<string>
}

class ImgurOAuth {
  private generateAccessTokenPromise: Promise<string>
  private timeoutId: NodeJS.Timeout

  constructor() {
    this._generateAccessToken()
  }

  getAccessToken(): Promise<string> {
    if (this.generateAccessTokenPromise) {
      return this.generateAccessTokenPromise
    } else {
      return this._generateAccessToken()
    }
  }

  private _generateAccessToken(): Promise<string> {
    const formData = new FormData()
    formData.append('refresh_token', process.env.IMGUR_REFRESH_TOKEN)
    formData.append('client_id', process.env.IMGUR_CLIENT_ID)
    formData.append('client_secret', process.env.IMGUR_CLIENT_SECRET)
    formData.append('grant_type', 'refresh_token')

    this.generateAccessTokenPromise = fetch(
      process.env.IMGUR_ACCESS_TOKEN_URL,
      {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      },
    )
      .then(async (response) => {
        const data =
          (await response.json()) as IImgurGenerateAccessTokenResponseModel
        this.clearRefreshTimer()
        this.setRefreshTimer()
        return data.access_token
      })
      .catch((error) => {
        this.generateAccessTokenPromise = null
        throw error
      })

    return this.generateAccessTokenPromise
  }

  private setRefreshTimer() {
    this.timeoutId = setTimeout(() => {
      this._generateAccessToken()
    }, TOKEN_REFRESH_INTERVAL)
  }

  private clearRefreshTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}

export const ImgurOAuthInstance = new ImgurOAuth()
