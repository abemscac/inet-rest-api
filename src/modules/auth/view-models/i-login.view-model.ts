import { IRefreshViewModel } from './i-refresh.view-model'

export interface ILoginViewModel extends IRefreshViewModel {
  refreshToken: string
}
