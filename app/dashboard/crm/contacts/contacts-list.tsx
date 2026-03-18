"use client";
import { useState } from "react";
import { Table, TableRow, TableHead, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash } from "lucide-react";

export function CRMContactsList({
  contacts,
  loading,
  error,
  onEdit,
  onRefresh,
}: {
  contacts: any[];
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
  if (!contacts || contacts.length === 0)
    return (
      <div className="text-center py-16">
        <div className="text-lg text-muted-foreground">No contacts found yet.</div>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                {contact.firstName} {contact.lastName}
              </TableCell>
              <TableCell>{contact.companyName || "---"}</TableCell>
              <TableCell>{contact.email || "---"}</TableCell>
              <TableCell>{contact.phone || "---"}</TableCell>
              <TableCell>{contact.status}</TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => onEdit(contact)}>
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