import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { subHours } from "date-fns";

export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((li) => {
        const lineSum = (li.quantity * li.price_data.unit_amount) / 100;
        sum += lineSum;
      });
    });
    console.log({ orders });
    return new Intl.NumberFormat("sv-SE").format(sum);
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter((o) => new Date(o.createdAt) > subHours(new Date(), 24));
  const ordersWeek = orders.filter((o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7));
  const ordersMonth = orders.filter((o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30));

  return (
    <div>
      <h2 className="text-gray-800 mb-4 text-xl">Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">Today</h3>
          <div className="text-3xl font-bold mt-1">{ordersToday.length}</div>
          <div className="text-xs text-gray-400">{ordersToday.length} orders today</div>
        </div>
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">This week</h3>
          <div className="text-3xl font-bold mt-1">{ordersWeek.length}</div>
          <div className="text-xs text-gray-400">{ordersWeek.length} orders this week</div>
        </div>
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">This month</h3>
          <div className="text-3xl font-bold mt-1">{ordersMonth.length}</div>
          <div className="text-xs text-gray-400">{ordersMonth.length} orders this month</div>
        </div>
      </div>
      <h2 className="text-gray-800 mb-4 text-xl">Revenue</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">Today</h3>
          <div className="text-3xl font-bold mt-1">$ {ordersTotal(ordersToday)}</div>
          <div className="text-xs text-gray-400">{ordersToday.length} orders today</div>
        </div>
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">This week</h3>
          <div className="text-3xl font-bold mt-1">$ {ordersTotal(ordersWeek)}</div>
          <div className="text-xs text-gray-400">{ordersWeek.length} orders this week</div>
        </div>
        <div className="bg-white shadow-md p-2 text-blue-900 text-center">
          <h3 className="uppercase text-gray-500 font-bold text-xs m-0">This month</h3>
          <div className="text-3xl font-bold mt-1">$ {ordersTotal(ordersMonth)}</div>
          <div className="text-xs text-gray-400">{ordersMonth.length} orders this month</div>
        </div>
      </div>
    </div>
  );
}
