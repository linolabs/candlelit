export const isLoginDialogOpen = ref(false);
export function useLoginDialog() {
  isLoginDialogOpen.value = true;
}

export const isOrderEditDialogOpen = ref(false);
export const editingOrderIndexer = ref<number | undefined>();

/**
 * Please **explicity** pass `undefined` when used for adding new order.
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
