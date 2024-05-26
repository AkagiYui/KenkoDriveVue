/**
 * 将日期字符串转换为Date对象
 * @param date 日期字符串
 * @returns Date对象
 */
export function unmarshalDate(date: string | Date) {
  if (date instanceof Date) {
    return date
  }

  const parts: number[] = date.split(/[-T:.+]/).map((part) => parseInt(part, 10))
  // 注意：JavaScript中的月份从0开始，所以需要将月份减1
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5])
}
