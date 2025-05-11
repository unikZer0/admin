import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserComponentCard from "../../components/common/ComponentCard";
import UserTable from "../../components/tables/UserTable";

export default function User() {
  return (
    <>
      <PageBreadcrumb pageTitle="Users page" />
      <div className="space-y-6 ">
        <UserComponentCard title="Users Table">
          <div className="container px-6">
          <div className="flex justify-start">
            <p className="font-medium text-xl dark:text-white">
              Users table
            </p>
          </div>

            </div>
          <UserTable />
          
        </UserComponentCard>
      </div>
    </>
  );
}
