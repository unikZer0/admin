import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CustomerComponentCard from "../../components/common/ComponentCard";
import CustomerTable from "../../components/tables/CustomerTable";

export default function Customer() {
  return (
    <>
      <PageBreadcrumb pageTitle="Customer Management" />
      <div className="space-y-6">
        <CustomerComponentCard title="Customer Management">
          <div className="container px-6">
            <div className="flex justify-start">
              <p className="font-medium text-xl dark:text-white">
                ຈັດການລູກຄ້າ
              </p>
            </div>
          </div>
          <CustomerTable />
        </CustomerComponentCard>
      </div>
    </>
  );
} 
