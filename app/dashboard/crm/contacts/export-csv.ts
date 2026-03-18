export function exportContactsCSV(contacts: any[]) {
  if (!contacts.length) return;
  const header = [
    "First Name",
    "Last Name",
    "Company",
    "Email",
    "Phone",
    "Job Title",
    "Status",
    "Notes",
  ];
  const rows = contacts.map((c) => [
    c.firstName,
    c.lastName,
    c.companyName || "",
    c.email || "",
    c.phone || "",
    c.jobTitle || "",
    c.status,
    c.notes ? (c.notes.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")) : "",
  ]);
  const csv =
    [header, ...rows].map((r) =>
      r.map((v) => `"${v ?? ""}"`).join(",")
    ).join("\r\n");

  const blob = new Blob([csv], {type: "text/csv"});
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `leadflow-contacts-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}