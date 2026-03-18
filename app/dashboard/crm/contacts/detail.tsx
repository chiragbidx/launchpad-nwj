"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CRMContactDetail({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId) return;
    const fetchContact = async () => {
      setLoading(true);
      const res = await fetch(`/api/crm/contacts/${contactId}`);
      if (res.ok) {
        setContact(await res.json());
      }
      setLoading(false);
    };
    fetchContact();
  }, [contactId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center text-destructive py-8">
        Contact not found.
      </div>
    );
  }

  return (
    <Card className="p-5 max-w-[520px] mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-2">
        {contact.firstName} {contact.lastName}
      </h2>
      <div className="mb-1 text-muted-foreground">{contact.jobTitle}</div>
      <div className="mb-2">{contact.email || "---"}</div>
      <div className="mb-2">{contact.phone || "---"}</div>
      <div className="mb-2">
        Company: {contact.companyName || "---"}
      </div>
      <div className="mb-2">
        Status: {contact.status}
      </div>
      <div className="mb-3">{contact.notes}</div>
      <div className="text-sm text-muted-foreground">
        Created: {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ""}
      </div>
      <div className="text-sm text-muted-foreground">
        Updated: {contact.updatedAt ? new Date(contact.updatedAt).toLocaleString() : ""}
      </div>
      <div className="text-xs text-muted-foreground mt-2 pb-1">
        Created by: {contact.createdByName || contact.createdBy}
        <br />
        Updated by: {contact.updatedByName || contact.updatedBy}
      </div>
      <Button variant="secondary" className="mt-4" onClick={() => window.history.back()}>
        Back
      </Button>
    </Card>
  );
}