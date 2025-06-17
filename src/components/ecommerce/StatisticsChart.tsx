import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

export default function StatisticsChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);

  useEffect(() => {
    axios.post("http://localhost:3000/api/admin/monthlystats",{},{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then((res) => {
      const { months, sales, revenue } = res.data;
      setCategories(months);
      setSalesData(sales);
      setRevenueData(revenue);
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

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <h3 className="text-lg font-semibold">Monthly Stats</h3>
      <Chart options={options} series={series} type="area" height={310} />
    </div>
  );
}
