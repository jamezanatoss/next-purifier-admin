// import Layout from "@/components/Layout";
// import {useEffect, useState} from "react";
// import axios from "axios";
// import Spinner from "@/components/Spinner";

// export default function OrdersPage() {
//   const [orders,setOrders] = useState([]);
//   const [isLoading,setIsLoading] = useState(false);
//   useEffect(() => {
//     setIsLoading(true);
//     axios.get('/api/orders').then(response => {
//       setOrders(response.data);
//       setIsLoading(false);
//     });
//   }, []);
//   return (
//     <Layout>
//       <h1>คำสั่งซื้อ</h1>
//       <table className="basic">
//         <thead>
//           <tr>
//             <th>วันที่</th>
//             <th>ชำระ</th>
//             <th>สถานะ</th>
//             <th>ลูกค้า</th>
//             <th>สินค้า</th>
//             <th>เปลี่ยนสถานะ</th>
//           </tr>
//         </thead>
//         <tbody>
//         {isLoading && (
//           <tr>
//             <td colSpan={4}>
//               <div className="py-4">
//                 <Spinner fullWidth={true} />
//               </div>
//             </td>
//           </tr>
//         )}
//         {orders.length > 0 && orders.map(order => (
//           <tr>
//             <td>{(new Date(order.createdAt)).toLocaleString()}
//             </td>
//             <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
//               {order.paid ? 'YES' : 'NO'}
//             </td>
//             <td className={order.paid ? 'text-red-600' : 'text-red-600'}>
//               {order.paid ? 'กำลังจัดส่ง' : 'รอชำระ'}
//             </td>
//             <td>
//               {order.name} {order.email}<br />
//               {order.city} {order.postalCode} {order.country}<br />
//               {order.streetAddress}
//             </td>
//             <td>
//               {order.line_items.map(l => (
//                 <>
//                   {l.price_data?.product_data.name} x
//                   {l.quantity}<br />
//                 </>
//               ))}
//             </td>
//             <td>
//               add Change status
//             </td>
//           </tr>
//         ))}
//         </tbody>
//       </table>
//     </Layout>
//   );
// }

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  const handleChangeStatus = async (orderId) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { status: 'shipped' });
      console.log("response",response)  
      if (response.status === 200) {
        const updatedOrders = orders.map(order => {
          if (order._id === orderId) {
            order.status = 'shipped';
          }
          return order;
        });
        setOrders(updatedOrders);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('An error occurred while updating order status', error);
    }
  };

  return (
    <Layout>
      <h1>คำสั่งซื้อ</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ชำระ</th>
            <th>สถานะ</th>
            <th>ลูกค้า</th>
            <th>สินค้า</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 && orders.map(order => (
            <tr key={order._id}>
              
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                {order.paid ? 'YES' : 'NO'}
              </td>
              
              <td className={order.paid ? 'text-red-600' : 'text-red-600'}>
                {order.paid ? (order.status === 'delivery' ? 'กำลังจัดส่ง' : 'จัดส่งแล้ว') : 'รอชำระ'}
              </td>
              <td>
                {order.name} {order.email}<br />
                {order.city} {order.postalCode} {order.country}<br />
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map(l => (
                  <div key={l.productId}>
                    {l.price_data?.product_data.name} x {l.quantity}<br />
                  </div>
                ))}
              </td>
              <td>
              
                {order.paid && order.status === 'delivery' && (
                  <button onClick={() => handleChangeStatus(order._id)}>
                    เปลี่ยนสถานะเป็น Shipped
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}




