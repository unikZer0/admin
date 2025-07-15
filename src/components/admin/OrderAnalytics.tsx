import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Calendar,
  ShoppingCart,
} from "lucide-react";

interface OrderAnalyticsProps {
  stats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalRevenue: string;
    averageOrderValue: string;
    monthlyTrends: Array<{
      month: string;
      orderCount: number;
      monthlyRevenue: string;
    }>;
    topProducts: Array<{
      Product_ID: number;
      Product_Name: string;
      Brand: string;
      timesOrdered: number;
      totalQuantitySold: number;
      totalRevenue: string;
    }>;
  };
}

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ stats }) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LAK",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Prepare data for charts
  const monthlyData = stats.monthlyTrends.map((trend) => ({
    month: formatMonth(trend.month),
    orders: trend.orderCount,
    revenue: parseFloat(trend.monthlyRevenue),
  }));

  const statusData = [
    { name: "ສຳເລັດ", value: stats.completedOrders, color: "#10B981" },
    { name: "ລໍຖ້າ", value: stats.pendingOrders, color: "#F59E0B" },
    { name: "ຍົກເລີກ", value: stats.cancelledOrders, color: "#EF4444" },
  ];

  const topProductsData = stats.topProducts.slice(0, 5).map((product) => ({
    name: product.Product_Name,
    orders: product.timesOrdered,
    revenue: parseFloat(product.totalRevenue),
  }));

  // ApexCharts options
  const monthlyChartOptions = {
    chart: {
      type: 'line' as const,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'ລາຍການ',
          style: {
            color: '#3B82F6'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'ລາຍໄດ້ (LAK)',
          style: {
            color: '#10B981'
          }
        },
        labels: {
          formatter: (value: number) => formatPrice(value.toString()),
          style: {
            colors: '#6B7280'
          }
        }
      }
    ],
    colors: ['#3B82F6', '#10B981'],
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const
    },
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
          return seriesIndex === 0 ? value.toString() : formatPrice(value.toString());
        }
      }
    }
  };

  const monthlyChartSeries = [
    {
      name: 'ລາຍການ',
      data: monthlyData.map(item => item.orders)
    },
    {
      name: 'ລາຍໄດ້',
      data: monthlyData.map(item => item.revenue)
    }
  ];

  const statusChartOptions = {
    chart: {
      type: 'pie' as const
    },
    labels: statusData.map(item => item.name),
    colors: statusData.map(item => item.color),
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toString()
      }
    }
  };

  const statusChartSeries = statusData.map(item => item.value);

  const topProductsChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    xaxis: {
      categories: topProductsData.map(item => item.name),
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'ລາຍການ',
          style: {
            color: '#3B82F6'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'ລາຍໄດ້ (LAK)',
          style: {
            color: '#10B981'
          }
        },
        labels: {
          formatter: (value: number) => formatPrice(value.toString()),
          style: {
            colors: '#6B7280'
          }
        }
      }
    ],
    colors: ['#3B82F6', '#10B981'],
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const
    },
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
          return seriesIndex === 0 ? value.toString() : formatPrice(value.toString());
        }
      }
    }
  };

  const topProductsChartSeries = [
    {
      name: 'ລາຍການ',
      data: topProductsData.map(item => item.orders)
    },
    {
      name: 'ລາຍໄດ້',
      data: topProductsData.map(item => item.revenue)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ລາຍການທັງໝົດ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ລາຍໄດ້ທັງໝົດ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ລາຄາສະເລ່ຍ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(stats.averageOrderValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ອັດຕາສຳເລັດ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders > 0
                  ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            ແນວໂນ້ມປະຈຳເດືອນ
          </h3>
          <ReactApexChart
            options={monthlyChartOptions}
            series={monthlyChartSeries}
            type="line"
            height={300}
          />
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            ການແຈກຢາຍສະຖານະ
          </h3>
          <ReactApexChart
            options={statusChartOptions}
            series={statusChartSeries}
            type="pie"
            height={300}
          />
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          ສິນຄ້າຂາຍດີ
        </h3>
        <ReactApexChart
          options={topProductsChartOptions}
          series={topProductsChartSeries}
          type="bar"
          height={300}
        />
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ລາຍການສິນຄ້າຂາຍດີ
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ສິນຄ້າ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ຍີ່ຫໍ້
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ຈຳນວນລາຍການ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ຈຳນວນຂາຍ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ລາຍໄດ້
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.topProducts.map((product, index) => (
                <tr key={product.Product_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.Product_Name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.Brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.timesOrdered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.totalQuantitySold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatPrice(product.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics; 
