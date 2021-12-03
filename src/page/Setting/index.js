import React, { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  getDocs,
  collection,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { STORE } from "../../constant/firebase";

export default function Setting() {
  const [storeData, setStoreData] = useState({});
  const [isCreateStore, setIsCreateStore] = useState(false);
  const firestore = useRef(getFirestore()).current;

  function handleOnChange(e) {
    const { value, name } = e.target;

    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleKeyDown() {}

  useEffect(fetchStoreInfo, []);

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
        setStoreData(data);
      } else setIsCreateStore(true);
    });
  }

  function handleUpdate(e) {
    e.target.disabled = true;
    e.target.innerHTML = `<span class="spinner-border spinner-border-sm text-light" role="status"></span> Processing`;

    if (isCreateStore) {
      const storeRef = collection(firestore, STORE);
      addDoc(storeRef, storeData).then(() => {
        fetchStoreInfo();
        e.target.innerHTML = `Done`;
        setTimeout(() => {
          e.target.disabled = false;
          e.target.innerHTML = `Update`;
        }, 3000);
      });
    } else {
      const storeRef = doc(firestore, STORE, storeData.id);
      updateDoc(storeRef, storeData).then(() => {
        fetchStoreInfo();

        e.target.innerHTML = `Done`;
        setTimeout(() => {
          e.target.disabled = false;
          e.target.innerHTML = `Update`;
        }, 3000);
      });
    }
  }

  return (
    <div className="container">
      <div className="h3 d-flex align-items-baseline">Store Information</div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="storeName"
          data-next-element-id="productPrice"
          placeholder="Vegetables"
          defaultValue={storeData?.name}
          onChange={handleOnChange}
          name="name"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="storeName">Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="storePhone"
          data-next-element-id="productPrice"
          placeholder="Vegetables"
          defaultValue={storeData?.phone}
          onChange={handleOnChange}
          name="phone"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="storePhone">Phone</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="storeAddress"
          data-next-element-id="productPrice"
          placeholder="Vegetables"
          defaultValue={storeData?.address}
          onChange={handleOnChange}
          name="address"
          enterKeyHint="next"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="storeAddress">Address</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="storeCurrencySymbol"
          data-next-element-id="productPrice"
          placeholder="Vegetables"
          defaultValue={storeData?.currencySymbol}
          onChange={handleOnChange}
          name="currencySymbol"
          enterKeyHint="done"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="storeCurrencySymbol">Currency Symbol</label>
      </div>
      <div className="d-grid">
        <button
          className="btn btn-success shadow rounded-pill py-2"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
}
