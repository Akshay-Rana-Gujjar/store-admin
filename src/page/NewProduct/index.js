import React, { useEffect, useRef, useState } from "react";
import ProductItem from "../../component/ProductItem";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CATEGORY, PRODUCT, STORE } from "../../constant/firebase";

export default function NewProduct() {
  const [productData, setProductData] = useState(
    localStorage.getItem("product")
      ? JSON.parse(localStorage.getItem("product"))
      : {}
  );
  const [isUpdating, setIsUpdating] = useState(
    localStorage.getItem("product") ? true : false
  );
  const firestore = useRef(getFirestore()).current;
  const navigate = useNavigate();
  const category = useRef(
    localStorage.getItem("category") &&
      JSON.parse(localStorage.getItem("category"))
  ).current;

  function handleKeyDown(e) {
    console.log({ e });
    if (e.key === "Enter") {
      const { nextElementId } = e.target.dataset;

      const nextEle = document.querySelector(`#${nextElementId}`);

      nextEle ? nextEle.focus() : e.target.blur();
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  }

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
          // setImageUrl({
          //   file: blob,
          //   url: dataUrl,
          // });
          setProductData((prev) => ({ ...prev, img: dataUrl }));
        });
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.target.disabled = true;
    e.target.innerHTML = `<span class="spinner-border spinner-border-sm text-light" role="status"></span> Processing`;
    console.log({ productData });
    if (isUpdating) {
      const prodRef = doc(
        firestore,
        `${CATEGORY}/${category.id}/${PRODUCT}`,
        productData.id
      );
      updateDoc(prodRef, productData).then(() => {
        // setProductData({});
        e.target.disabled = false;
        e.target.innerHTML = "Update";
      });
    } else {
      const prodCollectionRef = collection(
        firestore,
        `${CATEGORY}/${category.id}/${PRODUCT}`
      );
      addDoc(prodCollectionRef, productData).then((docRef) => {
        setProductData({});
        e.target.disabled = false;
        e.target.innerHTML = "Add";
      });
    }
  }

  function fetchStoreInfo() {
    const storeRef = collection(firestore, STORE);

    getDocs(storeRef).then((docs) => {
      // console.log(docs.docs[0]);
      if (!docs.empty) {
        const docData = docs.docs[0];
        const data = {
          ...docData.data(),
          id: docData.id,
        };
        console.log(data);
        localStorage.setItem("store", JSON.stringify(data));
      }else{
				navigate("/setting");
			}
    });
  }

  useEffect(() => {
    localStorage.removeItem("product");
    const store = localStorage.getItem("store");
    if (store)
      setProductData((prev) => {
        const data = { ...prev };
        if (!prev?.currencySymbol) {
          const storeJson = JSON.parse(store);
          data.currencySymbol = storeJson.currencySymbol;
        }
        return data;
      });
    else fetchStoreInfo();
  }, []);

  if (!category) {
    navigate("/products");
    return null;
  }

  return (
    <div className="container">
      <div className="h3 d-flex align-items-baseline small">
        {isUpdating ? "Updating" : "Add New"} Product{" "}
        <div className="ms-1 small">in "{category?.name}"</div>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="productName"
          data-next-element-id="productPrice"
          placeholder="Vegetables"
          defaultValue={productData.name}
          onChange={handleOnChange}
          name="name"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="productName">Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="productPrice"
          data-next-element-id="productDiscount"
          placeholder="Vegetables"
          defaultValue={productData.price}
          onChange={handleOnChange}
          name="price"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="productPrice">Price</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="productDiscount"
          data-next-element-id="priceUnit"
          placeholder="Vegetables"
          defaultValue={productData.discountedPrice}
          onChange={handleOnChange}
          name="discountedPrice"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="productDiscount">Discounted Price</label>
      </div>
      <div className="row">
        <div className="col-6">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="priceUnit"
              data-next-element-id="priceCurrencySymbol"
              placeholder="Vegetables"
              defaultValue={productData.unit}
              onChange={handleOnChange}
              name="unit"
              enterKeyHint="done"
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="priceUnit">Unit</label>
          </div>
        </div>
        <div className="col-6">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="priceCurrencySymbol"
              placeholder="Vegetables"
              defaultValue={productData.currencySymbol}
              onChange={handleOnChange}
              name="currencySymbol"
              enterKeyHint="done"
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="priceCurrencySymbol">Currecy Symbol</label>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label htmlFor="formFile" class="form-label text-muted small">
          Product Image
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
        <div className="small text-muted">Preview</div>
        <ProductItem product={productData} productClass="col-6" hideActions />
      </div>

      <div className="d-grid mb-3">
        <button
          className="btn btn-success py-2 shadow-sm rounded-pill"
          onClick={handleSubmit}
        >
          {isUpdating ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}
