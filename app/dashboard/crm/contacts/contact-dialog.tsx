"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "customer", label: "Customer" },
  { value: "inactive", label: "Inactive" },
];

export function CRMContactDialog({ open, onClose, contact, onSaved, teamId }: {
  open: boolean;
  contact: any;
  onClose: () => void;
  onSaved: () => void;
  teamId: string;
}) {
  const isEdit = Boolean(contact);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    companyId: "",
    status: "lead",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contact) {
      setForm({
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        jobTitle: contact.jobTitle ?? "",
        companyId: contact.companyId ?? "",
        status: contact.status ?? "lead",
        notes: contact.notes ?? "",
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        companyId: "",
        status: "lead",
        notes: "",
      });
    }
  }, [contact, open]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Client-side validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      setLoading(false);
      return;
    }
    // Email: naive check
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email.");
      setLoading(false);
      return;
    }
    // Phone: optional, but if present, check format
    if (form.phone && !/^(\+?\d{9,15})?$/.test(form.phone)) {
      setError("Enter a valid phone number or leave blank.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/crm/contacts${isEdit ? `/${contact.id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, teamId }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save contact.");
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
            {isEdit ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="First name"
          />
          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Last name"
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email (optional)"
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone (optional)"
          />
          <Input
            label="Job Title"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
          />
          {/* Company select coming in full entity UI with list of companies */}
          <label className="flex flex-col">
            Status
            <select
              className="border rounded px-2 py-1 mt-1"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1 resize-y min-h-[56px]"
              placeholder="Notes"
            ></textarea>
          </label>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {isEdit ? "Save Changes" : "Add Contact"}
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