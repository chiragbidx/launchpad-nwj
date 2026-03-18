"use client";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// This example allows creation linked to either a contact OR a company.
const TYPE_OPTIONS = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
];

export function CRMActivityDialog({
  open,
  onClose,
  activity,
  onSaved,
  teamId,
}: {
  open: boolean;
  activity: any;
  onClose: () => void;
  onSaved: () => void;
  teamId: string;
}) {
  const isEdit = Boolean(activity);

  const [form, setForm] = useState({
    type: "call",
    subject: "",
    description: "",
    datetime: "",
    contactId: "",
    companyId: "",
    assignedUserId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: For production, fetch contacts/companies for selection dropdowns
  // For now, these are left as simple text fields or left out

  useEffect(() => {
    if (activity) {
      setForm({
        type: activity.type ?? "call",
        subject: activity.subject ?? "",
        description: activity.description ?? "",
        datetime: activity.datetime
          ? new Date(activity.datetime).toISOString().substring(0, 16)
          : "",
        contactId: activity.contactId ?? "",
        companyId: activity.companyId ?? "",
        assignedUserId: activity.assignedUserId ?? "",
      });
    } else {
      setForm({
        type: "call",
        subject: "",
        description: "",
        datetime: "",
        contactId: "",
        companyId: "",
        assignedUserId: "",
      });
    }
  }, [activity, open]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.type) {
      setError("Type is required.");
      setLoading(false);
      return;
    }
    if (!form.subject.trim()) {
      setError("Subject is required.");
      setLoading(false);
      return;
    }
    if (!form.datetime) {
      setError("Date/time is required.");
      setLoading(false);
      return;
    }
    // Must have either contact or company, not both or neither
    if ((!form.contactId && !form.companyId) || (form.contactId && form.companyId)) {
      setError("Link activity to either a contact or a company (not both).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/crm/activities${isEdit ? `/${activity.id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, teamId }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save activity.");
        setLoading(false);
        return;
      }
      onSaved();
    } catch (err) {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Activity" : "Add Activity"}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <label className="flex flex-col">
            Type
            <select
              className="border rounded px-2 py-1 mt-1"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            placeholder="Subject"
          />
          <label className="flex flex-col">
            Date/Time
            <input
              type="datetime-local"
              name="datetime"
              value={form.datetime}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1"
              required
            />
          </label>
          <label className="flex flex-col">
            Related Contact ID
            <input
              name="contactId"
              value={form.contactId}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1"
              placeholder="Contact ID (or leave blank for company)"
            />
          </label>
          <label className="flex flex-col">
            Related Company ID
            <input
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1"
              placeholder="Company ID (or leave blank if using contact)"
            />
          </label>
          <label className="flex flex-col">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1 resize-y min-h-[56px]"
              placeholder="Description"
            ></textarea>
          </label>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {isEdit ? "Save Changes" : "Add Activity"}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}