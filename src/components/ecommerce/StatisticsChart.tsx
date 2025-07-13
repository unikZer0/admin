import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

export default function StatisticsChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .post("http://localhost:3000/api/admin/monthlystats", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const { months = [], sales = [], revenueData = [] } = res.data;
        
        setCategories(months);
        setSalesData(sales.length === 12 ? sales : Array(12).fill(0));
        setRevenueData(revenueData.length === 12 ? revenueData : Array(12).fill(0));
      })
      .catch((err) => {
        console.error("Failed to load monthly stats:", err);
        setError("Failed to load data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "phetsarath ot, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val, { seriesIndex }) =>
          `${val} ${seriesIndex === 0 ? "sales" : "revenue"}`,
      },
      x: {
        formatter: (val) => `Month: ${val}`,
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: salesData,
    },
    {
      name: "Revenue",
      data: revenueData,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Stats</h3>
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold">Monthly Stats</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <h3 className="text-lg font-semibold">Monthly Stats</h3>
      <Chart options={options} series={series} type="area" height={310} />
    </div>
  );
}
