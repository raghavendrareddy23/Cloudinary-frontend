import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin,ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const ImageDisplay = () => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { id } = useParams(); // Correct syntax: { id }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("https://cloudinary-backend-iq8v.onrender.com/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const data = await response.json();
        setImageData(data.data); // Assuming the response contains an array of image data
        setLoading(false);
        setTimeout(() => {
            setImageData(data.data); // Assuming the response contains an array of image data
            setLoading(false); // Set loading to false after the delay to hide the loader
          }, 3000);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch image data");
      }
    };

    fetchImageData();
  }, [id]); // Ensure id is included as a dependency in useEffect

  const handleUpdate = (id) => {
    setSelectedImageId(id);
    setShowUpdateModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true); // Set delete loading to true
      const response = await fetch(`https://cloudinary-backend-iq8v.onrender.com/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      // Remove the deleted image from imageData
      setImageData((prevImageData) =>
        prevImageData.filter((image) => image._id !== id)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setDeleteLoading(false); // Set delete loading back to false after operation completes
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true); // Set update loading to true
    const formData = new FormData(e.target);
    try {
      const response = await fetch(
        `https://cloudinary-backend-iq8v.onrender.com/api/users/${selectedImageId}`,
        {
          method: "PUT",
          body: formData,
          // headers: {
          //   'Content-Type': 'multipart/form-data'
          // }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update image");
      }
      setShowUpdateModal(false);
      toast.success("Image updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image");
    } finally {
      setUpdateLoading(false); // Set update loading back to false after operation completes
    }
  };

  const navigateToImagesPage = () => {
    // Navigate to the page where you can view images
    navigate("/");
  };

  return (
    <div>
      <button
        onClick={navigateToImagesPage}
        className="m-3 py-3 px-5 bg-blue-500 text-white font-bold rounded focus:outline-none focus:shadow-outline"
      >
        Back to Upload File
      </button>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          <ThreeDots color="#FFFFFF" height={20} width={20} />
        ) : (
          imageData.map((image) => (
            <div key={image._id} className="max-w-xs mx-4 my-4">
              <img
                src={image.url}
                alt="User"
                className="rounded-lg w-full h-auto"
              />
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => handleUpdate(image._id)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  {updateLoading && selectedImageId === image._id ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  {deleteLoading && selectedImageId === image._id ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        {showUpdateModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Update Image</h2>
              <form onSubmit={handleSubmitUpdate}>
                <input type="file" name="image" accept="image/*" />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-1 px-3 rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ImageDisplay;
