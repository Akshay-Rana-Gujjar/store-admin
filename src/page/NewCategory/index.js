import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  doc,
} from "firebase/firestore";
import { CATEGORY } from "../../constant/firebase";
import getImageName from "../../utils/getImageName";
import deleteImage from "../../utils/deleteImage";
import uploadImage from "../../utils/uploadImage";

export default function NewCategory() {
  const [imageUrl, setImageUrl] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const firestore = useRef(getFirestore()).current;
  const [isUpdating, setIsUpdating] = useState(false);

  function handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file.name);

    reader.onloadend = () => {
      var image = new Image();
      image.onload = function (imageEvent) {
        var canvas = document.createElement("canvas"),
          max_height = 200,
          width = image.width,
          height = image.height;

        if (height > max_height) {
          const fraction = height / max_height;
          height = height / fraction;
          width = width / fraction;
        }
        canvas.globalAlpha = 0.0001;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL("image/png");
        console.log(width, height);
        canvas.toBlob((blob) => {
          console.log({ blob });
          setImageUrl({
            file: blob,
            url: dataUrl,
          });
        });
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  function handleName(e) {
    const { value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      name: value,
    }));
  }

  function handleSubmit(e) {
    e.target.disabled = true;
    e.target.innerText = "Processing";
    const file = imageUrl.file;

    uploadImage(file, (url) => {
      addDoc(collection(firestore, CATEGORY), {
        name: categoryData.name,
        img: url,
      }).then(() => {
        e.target.disabled = false;
        e.target.innerText = "Create";
      });
    });
  }

  function handleUpdate(e) {
    e.target.disabled = true;
    e.target.innerText = "Processing";
    const categoryRef = doc(firestore, CATEGORY, categoryData.id);

    if (imageUrl.file) {
      const imageName = getImageName(categoryData.img);
      deleteImage("category-images/" + imageName, () => {
        uploadImage(imageUrl.file, (url) => {
          updateDoc(categoryRef, { name: categoryData.name, img: url }).then(
            () => {
              e.target.disabled = false;
              e.target.innerText = "Update";
            }
          );
        });
      });
    } else {
      updateDoc(categoryRef, { name: categoryData.name }).then(() => {
        e.target.disabled = false;
        e.target.innerText = "Update";
      });
    }
  }

  useEffect(() => {
    const recordToBeEdit = localStorage.getItem("record");
    const category = recordToBeEdit && JSON.parse(recordToBeEdit);
    console.log({ category });
    setCategoryData(category);
    if (category) {
      setIsUpdating(true);
			localStorage.removeItem("record");
    }
  }, []);

  function CategoryItem({ category }) {
    return (
      <div className="category-item shadow card position-relative overflow-hidden">
        <img
          src={imageUrl.url || categoryData?.img}
          className="img-fluid"
          alt=""
        />
        <div className="position-absolute bottom-0 category-item-name w-100 p-2 ps-3 fw-bold text-white">
          {category?.name}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="h3">Create New Category</div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="Vegetables"
          defaultValue={categoryData?.name}
          onChange={handleName}
        />
        <label htmlFor="floatingInput">Name</label>
      </div>
      <div class="mb-3">
        <label htmlFor="formFile" class="form-label text-muted">
          Category Image
        </label>
        <input
          class="form-control"
          type="file"
          id="formFile"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />
      </div>
      <div className="mb-3">
        <CategoryItem category={categoryData} />
      </div>
      <div className="d-grid">
        <button
          className="btn btn-primary rounded-pill shadow py-2"
          onClick={isUpdating ? handleUpdate : handleSubmit}
        >
          {isUpdating ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
