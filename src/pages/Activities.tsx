import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { Link } from "react-router";
import {
  LogIn,
  Trash2,
  Pencil,
  Plus,
  Key,
  Bell,
  FileText,
  BarChart2 // Add this for 'Total Activities'
} from "lucide-react";

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

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const itemsPerPage = 20;

  useEffect(() => {
    fetchActivities();
  }, [currentPage, searchTerm, activityTypeFilter, dateFilter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/admin/allactivities",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            type: activityTypeFilter,
            date: dateFilter,
          },
        }
      );

      const data = response.data;
      setActivities(Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []));
      setTotalActivities(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActivityTypeFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const getActivityTypeColor = (activityType: string) => {
    if (activityType.includes("DELETE")) return "error";
    if (activityType.includes("UPDATE")) return "warning";
    if (activityType.includes("LOGIN")) return "info";
    if (activityType.includes("PASSWORD_CHANGE")) return "warning";
    if (activityType.includes("NOTIFICATION")) return "info";
    return "success";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActivityIcon = (activityType: string) => {
    if (activityType.includes("LOGIN")) return <LogIn className="w-5 h-5 text-blue-500" />;
    if (activityType.includes("DELETE")) return <Trash2 className="w-5 h-5 text-red-500" />;
    if (activityType.includes("UPDATE")) return <Pencil className="w-5 h-5 text-yellow-500" />;
    if (activityType.includes("CREATE")) return <Plus className="w-5 h-5 text-green-500" />;
    if (activityType.includes("PASSWORD")) return <Key className="w-5 h-5 text-yellow-700" />;
    if (activityType.includes("NOTIFICATION")) return <Bell className="w-5 h-5 text-indigo-500" />;
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Activity Log
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor all system activities and user actions
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Type
            </label>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="LOGIN">Login</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="PASSWORD">Password Change</option>
              <option value="NOTIFICATION">Notification</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Activities</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalActivities}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
              <LogIn className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Logins</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {activities.filter(a => a.Activity_Type.includes("LOGIN")).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900">
              <Pencil className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Updates</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {activities.filter(a => a.Activity_Type.includes("UPDATE")).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deletions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {activities.filter(a => a.Activity_Type.includes("DELETE")).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            All Activities
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-500">Loading activities...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <span className="text-4xl">📝</span>
              <p className="mt-2">No activities found</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Type
                  </TableCell>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Description
                  </TableCell>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    User Role
                  </TableCell>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Related ID
                  </TableCell>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    IP Address
                  </TableCell>
                  <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Date & Time
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activities.map((activity) => (
                  <TableRow key={activity.Activity_ID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getActivityIcon(activity.Activity_Type)}</span>
                        <Badge
                          size="sm"
                          color={getActivityTypeColor(activity.Activity_Type)}
                        >
                          {activity.Activity_Type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-300 max-w-xs truncate">
                      {activity.Activity_Description}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {activity.Role_Name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {activity.Related_ID || "-"}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {activity.IP_Address}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                      {formatDate(activity.Created_At)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalActivities)} of{" "}
                {totalActivities} results
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
