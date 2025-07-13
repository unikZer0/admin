import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router";

// Define the TypeScript interface for the activity rows
interface Activity {
  Activity_ID: number;
  User_ID: number;
  Activity_Type: string;
  Activity_Description: string;
  Related_ID: number;
  IP_Address: string;
  User_Agent: string;
  Created_At: string;
  Role_Name: string;
}

export default function RecentOrders() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/admin/activities",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setActivities(Array.isArray(response.data) ? response.data : (Array.isArray(response.data.data) ? response.data.data : []));
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Failed to fetch activities");
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Activities
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See all
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No activities</div>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Related ID</TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">IP Address</TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {activities.map((activity) => (
                <TableRow key={activity.Activity_ID}>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        activity.Activity_Type.includes("DELETE")
                          ? "error"
                          : activity.Activity_Type.includes("UPDATE")
                          ? "warning"
                          : activity.Activity_Type.includes("LOGIN")
                          ? "info"
                          : activity.Activity_Type.includes("PASSWORD_CHANGE")
                          ? "warning"
                          : "success"
                      }
                    >
                      {activity.Activity_Type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-300">
                    {activity.Activity_Description}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.Role_Name}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.Related_ID}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {activity.IP_Address}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                    {new Date(activity.Created_At).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
