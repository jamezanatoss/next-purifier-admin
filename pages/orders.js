import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Swal from 'sweetalert2';

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
      if (response.status === 200) {
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            order.status = 'shipped';
          }
          return order;
        });
        setOrders(updatedOrders);
        Swal.fire('สำเร็จ', 'สถานะถูกเปลี่ยนเป็น จัดส่งแล้ว', 'success');
      } else {
        console.error('Failed to update order status');
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะสินค้าได้', 'error');
      }
    } catch (error) {
      console.error('An error occurred while updating order status', error);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะสินค้าได้', 'error');
    }
  };

  const sendConfirmationEmail = async (orderId, email) => {
    console.log("orderId", orderId)
    console.log("email", email)
    try {
      await axios.post('/api/sendEmail', {
        recipient: email,
        subject: 'จัดส่งสำเร็จ',
        content: `เลขออเดอร์ ${orderId} จัดส่งสำเร็จแล้ว !`,

      });
      console.log('Confirmation email sent');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const showConfirmationDialog = async (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    if (!order) {
      console.error('Order not found');
      return;
    }

    const { email } = order;
    console.log(email);

    Swal.fire({
      title: 'ยืนยันการเปลี่ยนสถานะ',
      text: 'คุณต้องการเปลี่ยนสถานะเป็น จัดส่งแล้ว ใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่',
    }).then((result) => {
      if (result.isConfirmed) {
        handleChangeStatus(orderId);
        sendConfirmationEmail(orderId, email);
      }
    });
  };



  const handleChangeStatusInstalled = async (orderId) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { status: 'installed' });
      if (response.status === 200) {
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            order.status = 'installed';
          }
          return order;
        });
        setOrders(updatedOrders);
        Swal.fire('สำเร็จ', 'สถานะถูกเปลี่ยนเป็น ติดตั้งแล้ว', 'success');
      } else {
        console.error('Failed to update order status');
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะสินค้าได้', 'error');
      }
    } catch (error) {
      console.error('An error occurred while updating order status', error);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะสินค้าได้', 'error');
    }
  };

  const sendConfirmationEmailInstalled = async (orderId, email) => {

    try {
      await axios.post('/api/sendEmail', {
        recipient: email,
        subject: 'ติดตั้งสำเร็จ',
        content: `เลขออเดอร์ ${orderId} ติดตั้งสำเร็จแล้ว !`,

      });
      console.log('Confirmation email sent');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const showConfirmationDialogInstalled = async (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    if (!order) {
      console.error('Order not found');
      return;
    }

    const { email } = order;
    console.log(email);

    Swal.fire({
      title: 'ยืนยันการเปลี่ยนสถานะ',
      text: 'คุณต้องการเปลี่ยนสถานะเป็น ติดตั้งแล้ว ใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่',
    }).then((result) => {
      if (result.isConfirmed) {
        handleChangeStatusInstalled(orderId);
        sendConfirmationEmailInstalled(orderId, email);
      }
    });
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

              <td style={{ color: order.paid ? (order.status === 'delivery' ? 'black' : (order.status === 'shipped' ? 'blue' : 'green')) : 'red' }}>
                {order.paid ? (order.status === 'delivery' ? 'กำลังจัดส่ง' : (order.status === 'shipped' ? 'จัดส่งแล้ว' : 'ติดตั้งแล้ว')) : 'รอชำระ'}
              </td>

              <td>
                <span style={{ color: "red" }}>ID: {order._id}</span><br />
                {order.name} {order.email}<br />
                {order.city} {order.postalCode} {order.phone}<br />
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
                  <div>
                    <button
                      key={order._id}
                      onClick={() => showConfirmationDialog(order._id)}
                      style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      เปลี่ยนสถานะเป็น จัดส่งแล้ว
                    </button>
                    <br />

                  </div>
                )}

                {order.paid && order.status === 'shipped' && (
                  <div>
                    <button
                      key={order._id}
                      onClick={() => showConfirmationDialogInstalled(order._id)}
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      เปลี่ยนสถานะเป็น ติดตั้งแล้ว
                    </button>
                    <br />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}




