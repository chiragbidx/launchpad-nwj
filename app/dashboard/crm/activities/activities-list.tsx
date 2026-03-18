"use client";
import { Table, TableRow, TableHead, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash } from "lucide-react";

export function CRMActivitiesList({
  activities,
  loading,
  error,
  onEdit,
  onRefresh,
}: {
  activities: any[];
  loading: boolean;
  error: string | null;
  onEdit: (a: any) => void;
  onRefresh: () => void;
}) {
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  if (error)
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded">
        {error}
        <Button className="ml-3" variant="secondary" onClick={onRefresh}>
          Retry
        </Button>
      </div>
    );
  if (!activities || activities.length === 0)
    return (
      <div className="text-center py-16">
        <div className="text-lg text-muted-foreground">No activities logged yet.</div>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Related</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.subject}</TableCell>
              <TableCell>
                {activity.datetime
                  ? new Date(activity.datetime).toLocaleString()
                  : "---"}
              </TableCell>
              <TableCell>
                {activity.contactId
                  ? `${activity.contactName ?? ""} ${activity.contactLastName ?? ""}`
                  : activity.companyName || "---"}
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => onEdit(activity)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    // open delete confirmation, to be implemented in dialog
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}