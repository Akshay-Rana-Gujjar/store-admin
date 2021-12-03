import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function uploadImage(file, fn, bucketName = "category-images/") {
    const storage = getStorage();
    const storageRef = ref(storage, bucketName + new Date().getTime());
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("File available at", url);
        fn(url);
      });
    });
  }