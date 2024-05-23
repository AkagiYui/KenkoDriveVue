import { useModal } from "naive-ui"

export function useConfirmModal() {
  const modal = useModal()

  function openConfirmModal(positive?: () => void, negative?: () => void) {
    const m = modal.create({
      preset: "dialog",
      title: "确认",
      content: "此操作不可撤销，请确认是否继续？",
      positiveText: "确认",
      negativeText: "取消",
      type: "warning",
      closable: true,
      positiveButtonProps: {
        type: "error",
      },
      onPositiveClick: () => {
        positive && positive()
        m.destroy()
      },
      onNegativeClick: () => {
        negative && negative()
        m.destroy()
      },
    })
  }

  return { openConfirmModal }
}
