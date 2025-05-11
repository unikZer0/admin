import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ProductTable from "../../components/tables/ProductTable";

export default function Product() {
  return (
    <>
      <PageBreadcrumb pageTitle="Products table" />
      <div className="space-y-6">
        <ComponentCard title="Products Table">
          <div className="container px-6">
          <div className="flex justify-start">
            <p className="font-medium text-xl dark:text-white">
              Product table
            </p>
          </div>
            </div>
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  );
}
