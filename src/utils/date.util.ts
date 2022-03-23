export interface IDateUtil {
  timeLapse(base: Date, options?: ITimeLapseOptions): Date
}

export interface ITimeLapseOptions {
  year?: number
  month?: number
  week?: number
  day?: number
}

class Util implements IDateUtil {
  timeLapse(base: Date, options?: ITimeLapseOptions): Date {
    const { year = 0, month = 0, week = 0, day = 0 } = options
    const date = new Date(base)

    if (year) date.setUTCFullYear(date.getUTCFullYear() + year)
    if (month) date.setUTCMonth(date.getUTCMonth() + month)
    if (week) date.setUTCDate(date.getUTCDate() + 7 * week)
    if (day) date.setUTCDate(date.getUTCDate() + day)

    return date
  }
}

export const DateUtil = new Util()
