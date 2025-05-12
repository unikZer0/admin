import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { UserPlus, UserMinus } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserTable() {
  type User = {
    UID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Role_id: number;
    Sex: string;
    Image?: string;
    RegistrationDate: string;
  };
  const userRole = localStorage.getItem("role");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/admin/getusers/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(res.data.data);
      } catch (error) {
        console.error(error);
        setError("Load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (userRole !== "1" && userRole !== "2") {
    return <div>You are not authorized to view this page. </div>;
  }
  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Profile image</TableCell>
              <TableCell isHeader>Profile </TableCell>
              <TableCell isHeader>UID</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Phone</TableCell>
              <TableCell isHeader>Gender</TableCell>
              <TableCell isHeader>Registration Date</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.UID}>
                <TableCell>
                  <div className="ml-10 flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        src={user.Image || "/images/default-profile.jpg"}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.FirstName} {user.LastName}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.Role_id === 1
                          ? "admin"
                          : user.Role_id === 2
                          ? "manager"
                          : "customer"}
                      </span>
                    </div>
                </TableCell>
                <TableCell>{user.UID}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.Phone}</TableCell>
                <TableCell>{user.Sex}</TableCell>
                <TableCell>
                  {new Date(user.RegistrationDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button size="xs" variant="primary" endIcon={<UserPlus />} />
                  <Button size="xs" variant="danger" endIcon={<UserMinus />} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
