export enum ProcessEnvironment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

export const isDevelopment = () => {
  return process.env.NODE_ENV === ProcessEnvironment.Development
}

export const isTest = () => {
  return process.env.NODE_ENV === ProcessEnvironment.Test
}
