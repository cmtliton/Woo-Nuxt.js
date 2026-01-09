export const buildCategoryTree: any = (items: any[], parentId = 0) => {
  return items
    .filter((item) => item.parent === parentId)
    .map((item) => ({
      ...item,
      // Recursively find children for this category
      children: buildCategoryTree(items, item.id),
    }));
};