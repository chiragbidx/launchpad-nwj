"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CRMActivityDetail({ activityId }: { activityId: string }) {
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activityId) return;
    const fetchActivity = async () => {
      setLoading(true);
      const res = await fetch(`/api/crm/activities/${activityId}`);
      if (res.ok) {
        setActivity(await res.json());
      }
      setLoading(false);
    };
    fetchActivity();
  }, [activityId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center text-destructive py-8">
        Activity not found.
      </div>
    );
  }

  return (
    <Card className="p-5 max-w-[520px] mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-2">{activity.subject}</h2>
      <div className="mb-2">Type: {activity.type}</div>
      <div className="mb-2">When: {activity.datetime ? new Date(activity.datetime).toLocaleString() : "---"}</div>
      <div className="mb-2">{activity.description}</div>
      <div className="text-sm text-muted-foreground">
        Created: {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ""}
      </div>
      <div className="text-sm text-muted-foreground">
        Updated: {activity.updatedAt ? new Date(activity.updatedAt).toLocaleString() : ""}
      </div>
      <div className="text-xs text-muted-foreground mt-2 pb-1">
        Created by: {activity.createdByName || activity.createdBy}
        <br />
        Updated by: {activity.updatedByName || activity.updatedBy}
      </div>
      <Button variant="secondary" className="mt-4" onClick={() => window.history.back()}>
        Back
      </Button>
    </Card>
  );
}