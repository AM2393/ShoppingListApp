import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteListDialogProps {
  list: { id: string; name: string } | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteListDialog({ list, onConfirm, onCancel }: DeleteListDialogProps) {
  if (!list) return null

  return (
    <Dialog open={!!list} onOpenChange={onCancel}>
      <DialogContent className="bg-[#7FFFD4]/20 border-none">
        <DialogHeader>
          <DialogTitle>Smazat nákupní seznam</DialogTitle>
          <DialogDescription>
            Opravdu chcete smazat nákupní seznam "{list.name}"? Tato akce je nevratná.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="bg-white">Zrušit</Button>
          <Button variant="destructive" onClick={onConfirm}>Smazat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

