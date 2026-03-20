import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { WorklogWithDetails } from "../../hooks/useWorklogs"
import { Check, Clock, AlertCircle } from "lucide-react"

interface WorklogDetailsProps {
  worklog: WorklogWithDetails
  onClose: () => void
  onApprove: (id: string) => void
  onPay: (id: string) => void
}

export function WorklogDetails({ worklog, onClose, onApprove, onPay }: WorklogDetailsProps) {
  
  const getStatusBadge = (status: string) => {
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      let icon = <Clock className="mr-1 h-3 w-3" />

      if (status === 'approved') {
        variant = "secondary"
        icon = <Check className="mr-1 h-3 w-3" />
      } else if (status === 'paid') {
        variant = "default"
        icon = <Check className="mr-1 h-3 w-3" />
      } else if (status === 'rejected') {
        variant = "destructive"
        icon = <AlertCircle className="mr-1 h-3 w-3" />
      }

      return (
        <Badge variant={variant} className="capitalize w-fit flex items-center">
          {icon}{status}
        </Badge>
      )
  }

  return (
    <SheetContent className="w-full  flex flex-col h-full overflow-hidden p-4">
      <SheetHeader className="pb-4 border-b shrink-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-6">
            <SheetTitle className="text-xl font-semibold break-words">{worklog.project}</SheetTitle>
            {getStatusBadge(worklog.status)}
        </div>
        <SheetDescription>
          Submitted by <span className="font-semibold text-foreground">{worklog.freelancerName}</span> on {new Date(worklog.date).toLocaleDateString()}
        </SheetDescription>
      </SheetHeader>
      
      <div className="flex-1 px-1 py-4 overflow-y-auto min-h-0">
        <div className="space-y-6 pr-2">
            <div>
                <h4 className="font-medium mb-2 text-sm text-foreground">Description</h4>
                <p className="text-sm border p-3 rounded-md bg-muted/30 whitespace-pre-wrap">{worklog.description}</p>
            </div>

            <div>
                <h4 className="font-medium mb-2 text-sm text-foreground">Time Entries</h4>
                <div className="space-y-3">
                    {worklog.entries.map((entry) => (
                        <Card key={entry.id} className="p-3 text-sm hover:bg-muted/10 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                                <span className="font-medium">{entry.description}</span>
                                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{entry.date}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground border-t pt-2 mt-2">
                                <span>{entry.hours}h @ ${entry.rate}/hr</span>
                                <span className="font-medium text-foreground">${entry.total}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 mt-4">
                <span className="font-medium text-lg">Total Amount</span>
                <span className="text-2xl font-bold tracking-tight">${worklog.amount}</span>
            </div>
        </div>
      </div>

      <SheetFooter className="mt-auto border-t pt-4 shrink-0 flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto order-1 sm:order-0">Close</Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-0 sm:order-1">
            {worklog.status === 'pending' && (
                <Button variant="default" onClick={() => onApprove(worklog.id)} className="w-full sm:w-auto">Approve Worklog</Button>
            )}
            {worklog.status === 'approved' && (
                <Button onClick={() => onPay(worklog.id)} className="w-full sm:w-auto">Mark as Paid</Button>
            )}
          </div>
      </SheetFooter>
    </SheetContent>
  )
}
