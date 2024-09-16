import React, { useState } from 'react';

function ImageUpload() {
    const [image, setImage] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError("Please select an image to upload.");
            return;
        }
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setPredictions(data.predictions); 
        } catch (err) {
            console.error("Error:", err);  
            setError("An error occurred while uploading the image.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Bone Fracture Detection</h1>
            <p className="text-gray-600 text-center mb-6">Upload an X-ray image to detect fractures.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100 cursor-pointer"/>
                    <p className="text-sm text-gray-500 mt-2">Accepted formats: JPG, PNG, GIF</p>
                </div>

                <button type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
                >
                    {loading ? "Processing..." : "Upload and Detect"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* Display the predictions or "No fracture" message */}
            {!loading && predictions.length === 0 && !error && (
                <div className="mt-8 p-6 bg-blue-100 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-blue-700">No fracture detected</h2>
                </div>
            )}

            {predictions.length > 0 && (
                <div className="mt-8 p-6 bg-green-100 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-green-700">Predicted Fractures:</h2>
                    <ul className="list-disc ml-6 mt-4 space-y-2 text-lg text-gray-700">
                        {predictions.map((label, index) => (
                            <li key={index}>{label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
