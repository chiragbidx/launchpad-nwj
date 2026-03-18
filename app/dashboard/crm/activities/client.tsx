"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CRMActivitiesList } from "./activities-list";
import { CRMActivityDialog } from "./activity-dialog";
import { Plus } from "lucide-react";

export function CRMActivitiesClient({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // activity | null
  const [refreshFlag, setRefreshFlag] = useState(0);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/activities?teamId=${encodeURIComponent(teamId)}`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      setActivities(await res.json());
      setLoading(false);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error loading activities"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [refreshFlag]);

  const onEdit = (activity: any) => {
    setEditing(activity);
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

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Activities</h2>
          <p className="text-muted-foreground">Log all sales, support, and client actions in LeadFlow.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>
      <CRMActivitiesList
        activities={activities}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onRefresh={() => setRefreshFlag((r) => r + 1)}
      />
      <CRMActivityDialog
        open={open}
        onClose={onClose}
        onSaved={onSaved}
        activity={editing}
        teamId={teamId}
      />
    </div>
  );
}