import React, { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CATEGORY, STORE } from "../../constant/firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import "./style.css";
import { Delete, Edit } from "../../component/Icons";
import { Link, useNavigate } from "react-router-dom";
import getImageName from "../../utils/getImageName";
import deleteImage from "../../utils/deleteImage";

export default function Home() {
  const [categoryData, setCategoryData] = useState([]);

  const firestore = useRef(getFirestore()).current;

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategory();
  
  }, []);

  function CategoryItem({ category, onEditClick, onDeleteClick }) {
    return (
      <div className="category-item shadow card position-relative overflow-hidden">
        <div className="d-flex position-absolute top-0 end-0 me-1 mt-1 action-option">
          <div
            className="rounded-circle card p-2 shadow me-2"
            onClick={() => onEditClick(category)}
          >
            <Edit />
          </div>
          <div
            className="rounded-circle card p-2 shadow"
            onClick={() => onDeleteClick && onDeleteClick(category)}
          >
            <Delete />
          </div>
        </div>
        <img src={category.img} className="img-fluid" alt="" />
        <div className="position-absolute bottom-0 category-item-name w-100 p-2 ps-3 fw-bold text-white">
          {category.name}
        </div>
      </div>
    );
  }

  function handleDeleteClick(category) {
    const shouldDelete = window.confirm("Delete Are you sure?");
    if (shouldDelete) {
      const categoryId = category.id;
      const { img } = category;
      const imageName = getImageName(img);
      const categoryDoc = doc(firestore, CATEGORY, categoryId);
      deleteImage("category-images/" + imageName, () => {
        deleteDoc(categoryDoc).then(() => {
          fetchCategory();
        });
      });
    }
  }

  function handleEdit(category) {
    localStorage.setItem("record", JSON.stringify(category));
    navigate("new-category");
  }

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

  

  return (
    <div className="container">
      <div className="h3">Manage Category</div>
      <Link
        to="/new-category"
        className="btn btn-secondary btn-sm rounded-pill shadow-sm mb-3 px-3"
      >
        Add new Category
      </Link>
      <div className="row">
        {categoryData.map((doc) => (
          <div className="col-md-6 mb-3">
            <CategoryItem
              category={doc}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
