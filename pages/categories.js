import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  }
  function deleteCategory(category) {
    swal.fire({
      title: 'แน่ใจหรือไม่?',
      text: `คุณต้องการที่จะลบ ${category.name} ใช่หรือไม่ ?`,
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่ ลบเลย !',
      confirmButtonColor: '#d55',
      reverseButtons: true,
      
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `แก้ไขหมวดหมู่สินค้า ${editedCategory.name}`
          : 'สร้างหมวดหมู่สินค้าใหม่'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'ชื่อหมวดหมู่สินค้า'}
            onChange={ev => setName(ev.target.value)}
            value={name} />
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}>
            <option value="">ไม่มีแม่ของหมวดหมู่</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">คุณสมบัติ</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn btn-default text-sm mb-2">
            เพิ่มคุณสมบัติใหม่ +
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div key={property.value} className="flex gap-1 mb-2">

              <input type="text"
                className="mb-0"
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                value={property.name}
                placeholder="พวกสี" />

              <input type="text"
                className="mb-0"
                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                value={property.values}
                placeholder="พวกหิว" />


              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                ลบ
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
        <button type="submit"
            className="btn-primary py-1">
            Save
          </button>
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default">ยกเลิก</button>
          )}
          
        </div>
      </form>
      <br /> 
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>ชื่อหมวดหมู่สินค้า</td>
              <td>แม่ของหมวดหมู่สินค้า</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
