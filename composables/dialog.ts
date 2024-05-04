export const isLoginDialogOpen = ref(false);
export function useLoginDialog() {
  isLoginDialogOpen.value = true;
}

export const isOrderEditDialogOpen = ref(false);
export const editingOrderIndexer = ref<number | undefined>();

/**
 * Note: Pass `undefined` explicitly if used directly in `@click`,
 * otherwise indexer will be a PointerEvent object which breaks the functionality.
 * Or wrap it in a arrow function to avoid this.
 * @param indexer
 */
export async function useOrderEditDialog(indexer?: number) {
  editingOrderIndexer.value = indexer;
  isOrderEditDialogOpen.value = true;

  await until(isOrderEditDialogOpen).toBe(false);
  // use setTimeout to avoid ui flicker
  setTimeout(() => {
    editingOrderIndexer.value = undefined;
  }, 150);
}
