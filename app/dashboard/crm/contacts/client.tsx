"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CRMContactsList } from "./contacts-list";
import { CRMContactDialog } from "./contact-dialog";
import { Download } from "lucide-react";
import { exportContactsCSV } from "./export-csv";

export function CRMContactsClient({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // contact | null
  const [refreshFlag, setRefreshFlag] = useState(0);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/contacts?teamId=${encodeURIComponent(teamId)}`);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      setContacts(await res.json());
      setLoading(false);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error loading contacts"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, [refreshFlag]);

  const onEdit = (contact: any) => {
    setEditing(contact);
    setOpen(true);
  };
  const onClose = () => {
    setEditing(null);
    setOpen(false);
  };
  const onSaved = () => {
    setEditing(null);
    setOpen(false);
    setRefreshFlag((r) => r + 1);
  };

  const handleExport = () => exportContactsCSV(contacts);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Contacts</h2>
          <p className="text-muted-foreground">Manage your team’s contacts in LeadFlow.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setOpen(true)}>Add Contact</Button>
        </div>
      </div>
      <CRMContactsList
        contacts={contacts}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onRefresh={() => setRefreshFlag((r) => r + 1)}
      />
      <CRMContactDialog
        open={open}
        onClose={onClose}
        onSaved={onSaved}
        contact={editing}
        teamId={teamId}
      />
    </div>
  );
}