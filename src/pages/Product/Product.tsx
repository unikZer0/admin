import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ProductTable from "../../components/tables/ProductTable";
import Button from "../../components/ui/button/Button";
import {UserPlus} from "lucide-react"

export default function Product() {
  return (
    <>
      <PageBreadcrumb pageTitle="ຕາຕະລາງ ສິນຄ້າ" />
      <div className="space-y-6">
        <ComponentCard title="Products Table">
          <div className="container px-6">
          <div className="flex  justify-between">
            <p className="font-medium text-xl dark:text-white">
              ຕາຕະລາງ ສິນຄ້າ
            </p>
          </div>
            </div>
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  );
}
