export interface IImgurGenerateAccessTokenResponseModel {
  access_token: string
  expired_in: number
  token_type: string
  scope: string | null
  refresh_token: string
  account_id: number
  account_username: string
}
