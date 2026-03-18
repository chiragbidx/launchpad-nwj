export function exportCompaniesCSV(companies: any[]) {
  if (!companies.length) return;
  const header = [
    "Name",
    "Website",
    "Industry",
    "Status",
    "Description",
  ];
  const rows = companies.map((c) => [
    c.name,
    c.website || "",
    c.industry || "",
    c.status,
    c.description
      ? c.description.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")
      : "",
  ]);
  const csv =
    [header, ...rows].map((r) =>
      r.map((v) => `"${v ?? ""}"`).join(",")
    ).join("\r\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `leadflow-companies-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}