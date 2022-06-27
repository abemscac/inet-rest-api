import { ILoginViewModel } from './view-models/i-login.view-model'
import { IRefreshViewModel } from './view-models/i-refresh.view-model'

export const MockRefresh: IRefreshViewModel = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzZXIwIiwidXNlcm5hbWUiOiLkurrpoZ7kuIDomZ8iLCJjcmVhdGVkQXQiOjE2NTUyNTUxOTIzMDF9.NbdcTyUxuchtVzq3y_Ry_x9tCQKhl2XerNIM8hIz7SM',
}

export const MockLogin: ILoginViewModel = {
  accessToken: MockRefresh.accessToken,
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzZXIwIiwidXNlcm5hbWUiOiLkurrpoZ7kuIDomZ8iLCJjcmVhdGVkQXQiOjE2NTUyNTUxOTIzMDF9.nShZwTGEIzh0P_ms8tO18vM6FB7rcB4FL7fcMVrxE6Q',
}
