import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

type KpisData = {
  orderdata: {
    count: number;
    previousCount: number;
  };
  customerdata: {
    count: number;
    previousCount: number;
  };
};

export default function EcommerceMetrics() {
  const [kpis, setKpis] = useState<KpisData>({
    orderdata: { count: 0, previousCount: 0 },
    customerdata: { count: 0, previousCount: 0 },
  });

  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/admin/kpisdata",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { orderdata, customerdata } = res.data;
        
        setKpis({ orderdata, customerdata });
      } catch (error) {
        console.error("Failed to fetch KPI data", error);
      }
    };

    fetchKpis();
  }, []);

  // Calculate percentages
  const customerPercentage = calculatePercentageChange(
    kpis.customerdata.count,
    kpis.customerdata.previousCount
  );
  const orderPercentage = calculatePercentageChange(
    kpis.orderdata.count,
    kpis.orderdata.previousCount
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {kpis.customerdata.count ?? "-"}
            </h4>
          </div>
          {/* <Badge color={customerPercentage >= 0 ? "success" : "error"}>
            {customerPercentage >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(customerPercentage).toFixed(2)}%
          </Badge> */}
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {kpis.orderdata.count ?? "-"}
            </h4>
          </div>

          {/* <Badge color={orderPercentage >= 0 ? "success" : "error"}>
            {orderPercentage >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(orderPercentage).toFixed(2)}%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
