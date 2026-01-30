export default function useCategory(slug: any) {
  const { data: category, pending } = useFetch(`/api/categories/${slug}`);
  return { category, pending };
}
