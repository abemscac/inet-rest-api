export interface IImgurUploadImageResponseModel {
  status: number
  success: boolean
  data: IImgurImage
}

export interface IImgurImage {
  id: string
  title: string | null
  description: string | null
  datetime: number
  type: string
  animated: boolean
  width: number
  height: number
  size: number
  views: number
  bandwidth: number
  vote: unknown
  favorite: boolean
  nsfw: boolean | null
  section: unknown
  account_url: string | null
  account_id: number
  is_ad: boolean
  in_most_viral: boolean
  has_sound: boolean
  tags: Array<string>
  ad_type: number
  ad_url: string
  edited: string
  in_gallery: boolean
  deletehash: string
  name: string
  link: string
}
