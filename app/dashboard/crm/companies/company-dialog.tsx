"use client";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { value: "prospect", label: "Prospect" },
  { value: "client", label: "Client" },
  { value: "inactive", label: "Inactive" },
];

export function CRMCompanyDialog({ open, onClose, company, onSaved, teamId }: {
  open: boolean;
  company: any;
  onClose: () => void;
  onSaved: () => void;
  teamId: string;
}) {
  const isEdit = Boolean(company);

  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "",
    status: "prospect",
    description: "",
    mainContactId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name ?? "",
        website: company.website ?? "",
        industry: company.industry ?? "",
        status: company.status ?? "prospect",
        description: company.description ?? "",
        mainContactId: company.mainContactId ?? "",
      });
    } else {
      setForm({
        name: "",
        website: "",
        industry: "",
        status: "prospect",
        description: "",
        mainContactId: "",
      });
    }
  }, [company, open]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/crm/companies${isEdit ? `/${company.id}` : ""}`,
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
        setError(data.error || "Failed to save company.");
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
            {isEdit ? "Edit Company" : "Add Company"}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Company name"
          />
          <Input
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website"
          />
          <Input
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Industry"
          />
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
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded px-2 py-1 mt-1 resize-y min-h-[56px]"
              placeholder="Description"
            ></textarea>
          </label>
          {/* mainContactId select could go here if desired */}
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {isEdit ? "Save Changes" : "Add Company"}
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