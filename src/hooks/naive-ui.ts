import { NInput, useModal } from "naive-ui"

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

export function useRenameModal() {
  const modal = useModal()

  function openRenameModal(name: string, positive: (name: string) => void) {
    let newName = name
    const content = () => {
      return h(NInput, {
        defaultValue: newName,
        autofocus: true,
        onUpdateValue: (value) => {
          newName = value
        },
        placeholder: "新名称",
      })
    }

    const m = modal.create({
      preset: "dialog",
      title: "重命名",
      positiveText: "确认",
      negativeText: "取消",
      closable: true,
      content: content,
      onPositiveClick: () => {
        positive(newName)
        m.destroy()
      },
    })
  }

  return { openRenameModal }
}
