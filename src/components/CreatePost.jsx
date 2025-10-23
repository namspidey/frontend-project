import React, { useState } from "react";
import { createPost } from "../lib/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreatePost({ onPostCreated }) {
    const [caption, setCaption] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const token = localStorage.getItem("token");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && images.length === 0) {
            setToast({
                show: true,
                message: "Vui lòng nhập caption hoặc chọn ít nhất 1 ảnh!",
                type: "danger",
            });
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        images.forEach((img) => formData.append("images", img));

        try {
            setLoading(true);
            await createPost(formData, token);

            setCaption("");
            setImages([]);
            setPreviewUrls([]);

            // ✅ Hiện popup thành công
            setToast({
                show: true,
                message: "🎉 Đăng bài thành công!",
                type: "success",
            });

            // ✅ Reload danh sách bài viết sau 1s
            setTimeout(() => {
                if (onPostCreated) onPostCreated();
            }, 1000);
        } catch (error) {
            console.error("Lỗi khi đăng bài:", error.message);
            setToast({
                show: true,
                message: "❌ Đăng bài thất bại!",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Tạo bài viết mới</h5>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="form-control mb-3"
                            placeholder="Bạn đang nghĩ gì..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows="3"
                        ></textarea>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="form-control mb-3"
                        />

                        {previewUrls.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {previewUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt="preview"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="text-center"><button
                            type="submit"
                            className="btn btn-primary w-30"

                            disabled={loading}
                        >
                            {loading ? "Đang đăng..." : "Đăng bài"}
                        </button></div>

                    </form>
                </div>
            </div>

            {/* ✅ Toast popup thông báo */}
            {toast.show && (
                <div
                    className={`toast align-items-center text-white bg-${toast.type
                        } border-0 position-fixed bottom-0 end-0 m-3 show`}
                    role="alert"
                >
                    <div className="d-flex">
                        <div className="toast-body">{toast.message}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            onClick={() => setToast({ ...toast, show: false })}
                        ></button>
                    </div>
                </div>
            )}
        </>
    );
}
