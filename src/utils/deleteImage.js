import { getStorage, ref, deleteObject } from "firebase/storage";

export default function deleteImg(imgPath, fn){
			const storage = getStorage();      
      const imgRef = ref(storage, imgPath);
      // Delete the file
      deleteObject(imgRef)
        .then(() => {
          // File deleted successfully
          fn();
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
					console.log(error);
					alert("Error while deleting...");
        });
}