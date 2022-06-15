import { ImgurAlbum } from './modules/imgur/imgur.constants'

export interface IAppConfig {
  apiPort: string
  db: {
    host: string
    port: number
    username: string
    password: string
    name: string
  }
  inetAuth: {
    accessTokenSecret: string
    refreshTokenSecret: string
  }
  imgur: {
    oauth: {
      accessTokenUrl: string
      clientId: string
      clientSecret: string
      refreshToken: string
      ACCESS_TOKEN_DEV: string
    }
    image: {
      uploadApiUrl: string
      deleteApiUrl: string
      albumHashRecord: Record<ImgurAlbum, string>
    }
  }
}

const getAppConfig = (): IAppConfig => ({
  apiPort: process.env.API_PORT ?? '',
  db: {
    host: process.env.DB_HOST ?? '',
    port: Number(process.env.DB_PORT ?? ''),
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_NAME ?? '',
  },
  inetAuth: {
    accessTokenSecret: process.env.INET_ACCESS_TOKEN_SECRET ?? '',
    refreshTokenSecret: process.env.INET_REFRESH_TOKEN_SECRET ?? '',
  },
  imgur: {
    oauth: {
      accessTokenUrl: process.env.IMGUR_OAUTH_ACCESS_TOKEN_URL ?? '',
      clientId: process.env.IMGUR_OAUTH_CLIENT_ID ?? '',
      clientSecret: process.env.IMGUR_OAUTH_CLIENT_SECRET ?? '',
      refreshToken: process.env.IMGUR_OAUTH_REFRESH_TOKEN ?? '',
      ACCESS_TOKEN_DEV: process.env.IMGUR_ACCESS_TOKEN_DEV ?? '',
    },
    image: {
      uploadApiUrl: process.env.IMGUR_IMAGE_UPLOAD_API_URL ?? '',
      deleteApiUrl: process.env.IMGUR_IMAGE_DELETE_API_URL ?? '',
      albumHashRecord: {
        [ImgurAlbum.Article]: process.env.IMGUR_ALBUM_HASH_ARTICLE ?? '',
        [ImgurAlbum.ArticleCategory]:
          process.env.IMGUR_ALBUM_HASH_ARTICLE_CATEGORY ?? '',
        [ImgurAlbum.UserAvatar]: process.env.IMGUR_ALBUM_HASH_USER_AVATAR ?? '',
      },
    },
  },
})

export { getAppConfig }
