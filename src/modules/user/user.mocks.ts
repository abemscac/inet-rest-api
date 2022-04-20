import { IUserViewModel } from '~/shared-view-models/i-user.view-model'

export const MockUser: IUserViewModel = {
  id: 1,
  username: 'user0',
  name: '人類一號',
  avatarUrl: 'https://i.imgur.com/1yJEtrqs.jpeg',
  createdAt: new Date(),
}
