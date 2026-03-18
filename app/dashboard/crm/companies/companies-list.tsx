"use client";
import { Table, TableRow, TableHead, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash } from "lucide-react";

export function CRMCompaniesList({
  companies,
  loading,
  error,
  onEdit,
  onRefresh,
}: {
  companies: any[];
  loading: boolean;
  error: string | null;
  onEdit: (c: any) => void;
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
  if (!companies || companies.length === 0)
    return (
      <div className="text-center py-16">
        <div className="text-lg text-muted-foreground">No companies found yet.</div>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.website || "---"}</TableCell>
              <TableCell>{company.industry || "---"}</TableCell>
              <TableCell>{company.status}</TableCell>
              <TableCell className="truncate max-w-[240px]">
                {company.description || "---"}
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => onEdit(company)}>
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