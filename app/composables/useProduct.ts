export default function useProduct(slug: any) {
  const { data: productl, pending } = useFetch(`/api/products/${slug}`);
  return { productl, pending };
}
