import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";

export default function NewProduct() {
  return (
    <Layout>
      <h1>เพิ่มสินค้าใหม่</h1>
      <ProductForm />
    </Layout>
  );
}