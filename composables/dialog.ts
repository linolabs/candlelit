import type { TSendOrderResult } from '~/types';

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

export const isTimeQuickSelectOpen = ref(false);

export function useTimeQuickSelect() {
  isTimeQuickSelectOpen.value = true;
}

export const isSendOrderResultOpen = ref(false);
export const sendOrderResult = ref<TSendOrderResult>();
export function useSendOrderResultDialog(data: TSendOrderResult) {
  sendOrderResult.value = data;
  isSendOrderResultOpen.value = true;
}
