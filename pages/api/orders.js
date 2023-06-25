// import {mongooseConnect} from "@/lib/mongoose";
// import {Order} from "@/models/Order";

// export default async function handler(req,res) {
//   await mongooseConnect();
//   res.json(await Order.find().sort({createdAt:-1}));
// }

// const { mongooseConnect } = require("@/lib/mongoose");
// const { Order } = require("@/models/Order");

// export default async function handler(req, res) {
//   await mongooseConnect();

//   if (req.method === "PUT") {
//     const { orderId } = req.query;
//     const { status } = req.body;

//     try {
//       const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
//       if (!updatedOrder) {
//         return res.status(404).json({ error: "Order not found" });
//       }

//       return res.json(updatedOrder);
//     } catch (error) {
//       return res.status(500).json({ error: "Failed to update order status" });
//     }
//   } else if (req.method === "GET") {
//     return res.json(await Order.find().sort({ createdAt: -1 }));
//   }

//   return res.status(405).json({ error: "Method Not Allowed" });
// }

const { mongooseConnect } = require("@/lib/mongoose");
const { Order } = require("@/models/Order");

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "PUT") {
    const { orderId } = req.query;
    const { status } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
      if (!updatedOrder) {
        console.log("Order not found:", orderId);
        return res.status(404).json({ error: "Order not found" });
      }

      console.log("Updated order:", updatedOrder);
      return res.json(updatedOrder);
    } catch (error) {
      console.error("Failed to update order status:", error);
      return res.status(500).json({ error: "Failed to update order status" });
    }
  } else if (req.method === "GET") {
    const { orderId } = req.query;

    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          console.log("Order not found:", orderId);
          return res.status(404).json({ error: "Order not found" });
        }

        console.log("Retrieved order:", order);
        return res.json(order);
      } catch (error) {
        console.error("Failed to retrieve order:", error);
        return res.status(500).json({ error: "Failed to retrieve order" });
      }
    } else {
      try {
        const orders = await Order.find().sort({ createdAt: -1 });
        console.log("Retrieved orders:", orders);
        return res.json(orders);
      } catch (error) {
        console.error("Failed to retrieve orders:", error);
        return res.status(500).json({ error: "Failed to retrieve orders" });
      }
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}



