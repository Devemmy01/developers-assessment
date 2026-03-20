import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { columns } from '@/components/Worklogs/Columns'
import { DataTable } from '@/components/Worklogs/DataTable'
import { useWorklogs, WorklogWithDetails } from '@/hooks/useWorklogs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { Sheet } from "@/components/ui/sheet"
import { WorklogDetails } from "@/components/Worklogs/WorklogDetails"

export const Route = createFileRoute('/_layout/worklogs')({
  component: WorklogsPage,
})

function WorklogsPage() {
  const { data, isLoading, fetchWorklogs, updateWorklogStatus } = useWorklogs()
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [selectedWorklog, setSelectedWorklog] = useState<WorklogWithDetails | null>(null)

  useEffect(() => {
    fetchWorklogs()
  }, [fetchWorklogs])

  const selectedRows = data.filter((row) => rowSelection[row.id])
  
  const handleApprove = async (id?: string) => {
    const ids = id ? [id] : selectedRows.map(r => r.id)
    if (ids.length === 0) return
    const success = await updateWorklogStatus(ids, 'approved')
    if (success) {
        toast.success(`Approved ${ids.length} worklogs`)
        // Update local state for details view if open
        if (id && selectedWorklog && selectedWorklog.id === id) {
            setSelectedWorklog(prev => prev ? {...prev, status: 'approved'} : null)
        }
    } else {
        toast.error("Failed to approve worklogs")
    }
  }

  const handlePay = async (id?: string) => {
    const ids = id ? [id] : selectedRows.map(r => r.id)
    if (ids.length === 0) return
    const success = await updateWorklogStatus(ids, 'paid')
    if (success) {
        toast.success(`Paid ${ids.length} worklogs`)
        // Update local state for details view if open
        if (id && selectedWorklog && selectedWorklog.id === id) {
            setSelectedWorklog(prev => prev ? {...prev, status: 'paid'} : null)
        }
    } else {
        toast.error("Failed to pay worklogs")
    }
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Worklogs & Payments</h2>
        <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button 
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={() => handleApprove()}
                disabled={selectedRows.length === 0 || isLoading}
            >
                Approve Selected
            </Button>
            <Button 
                className="flex-1 md:flex-none"
                onClick={() => handlePay()}
                disabled={selectedRows.length === 0 || isLoading}
            >
                Pay Selected
            </Button>
        </div>
      </div>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                    Manage all freelancer worklogs here. Click on a row to view details.
                </CardDescription>
            </CardHeader>
            <CardContent>
             {isLoading && data.length === 0 ? (
                 <div className="flex items-center justify-center h-24">Loading...</div>
             ) : (
                <DataTable 
                    columns={columns} 
                    data={data} 
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    onRowClick={(row) => setSelectedWorklog(row as WorklogWithDetails)}
                    getRowId={(row) => row.id}
                />
             )}
            </CardContent>
        </Card>
      </div>

      <Sheet open={!!selectedWorklog} onOpenChange={(open) => !open && setSelectedWorklog(null)}>
        {selectedWorklog && (
            <WorklogDetails 
                worklog={selectedWorklog} 
                onClose={() => setSelectedWorklog(null)}
                onApprove={handleApprove}
                onPay={handlePay}
            />
        )}
      </Sheet>
    </div>
  )
}

