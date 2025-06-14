import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { UserPlus, UserMinus } from "lucide-react";
import UsersModal from "../Modal/UsersModal";
type User = {
  UID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role_id: number;
  Sex: string;
  Image?: string;
  Registration_Date: string;
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userRole = localStorage.getItem("role");

  const openModalWithUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/admin/getusers/",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (userRole !== "1" && userRole !== "2") {
    return <div>You are not authorized to view this page.</div>;
  }

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Profile image</TableCell>
              <TableCell isHeader>Profile</TableCell>
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
                  <div className="ml-2 flex items-center gap-3">
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
                  <div>
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {user.FirstName} {user.LastName}
                    </span>
                    <span className="block text-gray-500 text-sm dark:text-gray-400">
                      {user.Role_id === 1
                        ? "admin"
                        : user.Role_id === 2
                          ? "manager"
                          : "customer"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{user.UID}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{user.Email}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{user.Phone}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{user.Sex}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.Registration_Date &&
                    !isNaN(new Date(user.Registration_Date).getTime())
                    ? new Date(user.Registration_Date).toLocaleDateString()
                    : "Invalid Date"}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button
                    size="xs"
                    variant="primary"
                    endIcon={<UserPlus />}
                    onClick={() => openModalWithUser(user)}
                  />
                  <Button size="xs" variant="danger" endIcon={<UserMinus />} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <UsersModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser ?? undefined}
        />
      </div>
    </div>
  );
};

export default UserTable;
