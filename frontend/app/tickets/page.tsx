"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

const tickets = [
  {
    id: "T-1021",
    title: "VPN connectivity issue",
    category: "VPN / Network",
    priority: "High",
    status: "Escalated",
    aiReply:
      "We’ve detected a VPN tunnel handshake failure. Please restart your VPN client and ensure you are connected to a stable network. If the issue persists, IT will escalate this to Network Operations.",
  },
  {
    id: "T-1020",
    title: "Email login not working",
    category: "Identity & Access",
    priority: "Medium",
    status: "Needs Review",
    aiReply:
      "Your login attempt failed due to an authentication sync issue. Please reset your password and retry after 10 minutes.",
  },
  {
    id: "T-1019",
    title: "Printer not responding",
    category: "Hardware",
    priority: "Low",
    status: "Auto-Resolved",
    aiReply:
      "The printer queue was cleared automatically. Please retry printing. No further action is required.",
  },
];

export default function TicketsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th />
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((t) => {
                const isOpen = expandedId === t.id;

                return (
                  <>
                    {/* Main Row */}
                    <tr
                      key={t.id}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleRow(t.id)}
                    >
                      <td className="py-2">
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>

                      <td className="font-medium">{t.id}</td>
                      <td>{t.title}</td>
                      <td>{t.category}</td>
                      <td>
                        <Badge
                          variant={
                            t.priority === "High"
                              ? "destructive"
                              : t.priority === "Medium"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {t.priority}
                        </Badge>
                      </td>
                      <td>{t.status}</td>
                    </tr>

                    {/* Expanded Row */}
                    {isOpen && (
                      <tr className="bg-muted/30">
                        <td colSpan={6} className="p-4">
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Department
                              </p>
                              <p className="font-medium">{t.category}</p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Priority Level
                              </p>
                              <p className="font-medium">{t.priority}</p>
                            </div>

                            <div className="col-span-3">
                              <p className="text-xs text-muted-foreground mb-1">
                                AI Suggested Auto-Reply
                              </p>
                              <div className="rounded-md border bg-background p-3 text-sm">
                                {t.aiReply}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
