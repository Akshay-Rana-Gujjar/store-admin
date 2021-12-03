import React, { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
	doc
} from "firebase/firestore";
import { CATEGORY, PRODUCT } from "../../constant/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import ProductItem from "../../component/ProductItem";

export default function Product() {
  const [toggleCategory, setToggleCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const firestore = useRef(getFirestore()).current;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productData, setProductData] = useState([]);
	const navigate = useNavigate();

  function handleCategoryClick(c) {
    setToggleCategory(false);
    console.log({ c });
    setSelectedCategory(c);
    localStorage.setItem("category", JSON.stringify(c));
  }

  useEffect(fetchCategory, []);

  useEffect(fetchProducts, [selectedCategory]);

  function fetchCategory() {
    const collectionQuery = collection(firestore, CATEGORY);
    getDocs(collectionQuery).then((docs) => {
      const tempDocs = [];
      docs.forEach((doc) => {
        tempDocs.push({ ...doc.data(), id: doc.id });
      });
      console.log({ tempDocs });
      setCategoryData(tempDocs);
    });
  }

  function fetchProducts() {
    if (!selectedCategory || !selectedCategory.id) return;
    const collectionQuery = collection(
      firestore,
      CATEGORY + "/" + selectedCategory.id + "/" + PRODUCT
    );
    getDocs(collectionQuery).then((docs) => {
      const tempDocs = [];
      docs.forEach((doc) => {
        tempDocs.push({ ...doc.data(), id: doc.id });
      });
      console.log({ tempDocs });
      setProductData(tempDocs);
    });
  }

  function handleDelete(product) {
    const shouldDelete = window.confirm("Delete Are you sure?");
    if (shouldDelete) {
      const productId = product.id;
      const productDoc = doc(firestore, `${CATEGORY}/${selectedCategory.id}/${PRODUCT}`, productId);
      deleteDoc(productDoc).then(() => {
        fetchProducts();
      });
    }
  }

	function handleEdit(product){
		localStorage.setItem("product", JSON.stringify(product));
		navigate("/new-product");
	} 

  return (
    <div className="container">
      <div className="small my-2">Please select a category</div>
      <div class="dropdown mb-3">
        <button
          class="btn btn-success dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={() => {
            setToggleCategory((prev) => !prev);
          }}
        >
          {selectedCategory ? selectedCategory.name : "Select Category"}
        </button>
        <ul
          class={`dropdown-menu ${toggleCategory && "show"}`}
          aria-labelledby="dropdownMenuButton1"
        >
          {categoryData.map((c) => (
            <li onClick={() => handleCategoryClick(c)}>
              <div class="dropdown-item" href="#">
                {c.name}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedCategory && (
        <>
          <div className="h3">Products of "{selectedCategory.name}"</div>
          <Link
            to="/new-product"
            className="btn btn-sm btn-outline-success mb-3"
          >
            Add new Product
          </Link>
        </>
      )}
      <div className="row">
        {productData.map((p) => (
          <ProductItem
            product={p}
            productClass={"col-6 rounded-0"}
            onDeleteClick={handleDelete}
						onEditClick={handleEdit}
					/>
        ))}
      </div>
    </div>
  );
}
