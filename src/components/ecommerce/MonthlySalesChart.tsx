import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

export default function MonthlySalesChart() {
  const [salesData, setSalesData] = useState<number[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/admin/monthlysales",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rawSales = response.data.sales;

        const cleaned = rawSales.map((item: any) =>
          typeof item === "object" && item !== null && "allorder" in item
            ? item.allorder
            : item
        );

        setSalesData(cleaned);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#465FFF"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },
    yaxis: {
      title: { text: "" },
    },
    grid: {
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} sales` },
    },
  };

  const chartSeries = [
    {
      name: "Sales",
      data: salesData.length === 12 ? salesData : new Array(12).fill(0),
    },
  ];

  return (
    <div className="rounded-xl border p-5 bg-white">
      <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
}
