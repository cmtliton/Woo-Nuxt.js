export default function useProduct(slug: string) {
  const { data, pending } = useFetch<any[]>(`/api/products/${slug}`);
  return { data, pending };
}
