import React, { useState } from "react";
import { uploadProfilePic } from "../lib/api";

export default function UploadProfilePic({ onClose, onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Vui lòng chọn ảnh trước");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const result = await uploadProfilePic(file);
      onUploaded(result.profilePic);
      onClose();
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("Đã xảy ra lỗi khi tải ảnh. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white p-4 rounded shadow text-center d-flex flex-column align-items-center"
        style={{ width: 340 }}
      >
        <h5 className="mb-3">Cập nhật ảnh đại diện</h5>

        <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: 140 }}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="rounded-circle border"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
          ) : (
            <div
              className="border border-secondary d-flex justify-content-center align-items-center rounded-circle"
              style={{ width: 120, height: 120 }}
            >
              <span className="text-muted small">Chưa chọn ảnh</span>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control mb-3"
        />

        {message && <p className="text-danger small mb-2">{message}</p>}

        <div className="d-flex justify-content-between w-100 mt-2">
          <button className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button className="btn btn-primary px-4" onClick={handleUpload} disabled={loading}>
            {loading ? "Đang tải..." : "Tải lên"}
          </button>
        </div>
      </div>
    </div>
  );
}
