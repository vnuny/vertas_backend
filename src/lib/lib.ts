export function GenSlug(title: string) {
  const slug = title.toLowerCase().replace(/ /g, "-");
  return slug;
}
