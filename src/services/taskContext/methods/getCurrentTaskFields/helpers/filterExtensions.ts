export const filterByExtensions = (
  arr: string[],
  extensions: string[]
): string[] => {
  return arr.filter((item) =>
    extensions.some((extension) => item.endsWith(extension))
  )
}
