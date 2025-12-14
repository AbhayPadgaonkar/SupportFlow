"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  // ---------- STATE (dummy) ----------
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [escalateHighPriority, setEscalateHighPriority] = useState(true);
  const [notifyOnSlaBreach, setNotifyOnSlaBreach] = useState(true);

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* AI AUTOMATION */}
      <Card>
        <CardHeader>
          <CardTitle>AI Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Enable Auto-Replies</Label>
            <Switch
              checked={autoReplyEnabled}
              onCheckedChange={setAutoReplyEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Auto-Resolve Confidence Threshold
              <span className="ml-2 text-muted-foreground">
                ({confidenceThreshold})
              </span>
            </Label>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[confidenceThreshold]}
              onValueChange={(v) => setConfidenceThreshold(v[0])}
            />
            <p className="text-sm text-muted-foreground">
              Tickets above this confidence will be auto-resolved by the AI.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ESCALATION RULES */}
      <Card>
        <CardHeader>
          <CardTitle>Escalation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Always Escalate High Priority Tickets</Label>
            <Switch
              checked={escalateHighPriority}
              onCheckedChange={setEscalateHighPriority}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Escalate Low Confidence Decisions</Label>
            <Badge variant="outline">&lt; {confidenceThreshold}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* SLA RULES */}
      <Card>
        <CardHeader>
          <CardTitle>SLA & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Notify on SLA Breach</Label>
            <Switch
              checked={notifyOnSlaBreach}
              onCheckedChange={setNotifyOnSlaBreach}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>SLA Breach Threshold</Label>
            <Badge variant="secondary">30 mins</Badge>
          </div>
        </CardContent>
      </Card>

      {/* MODEL CONFIG */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Active Model</Label>
            <Badge>SLM-IT-v1.3</Badge>
          </div>

          <div className="flex items-center justify-between">
            <Label>Fallback Model</Label>
            <Badge variant="outline">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* SAVE */}
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
