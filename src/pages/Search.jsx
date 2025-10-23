import React, { useState } from "react";
import UserSearch from "../components/UserSearch";
import { searchUsers } from "../lib/api";
import { IoSearch } from "react-icons/io5";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(value);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3" style={{ maxWidth: "600px" }}>
      {/* Thanh tìm kiếm */}
      <div className="mb-3 position-relative">
        <IoSearch
          size={20}
          color="#888"
          className="position-absolute top-50 translate-middle-y"
          style={{ left: "12px" }}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Tìm kiếm người dùng..."
          className="form-control shadow-sm ps-5 py-2"
          style={{
            borderRadius: "12px",
            fontSize: "15px",
          }}
        />
      </div>

      {/* Danh sách kết quả */}
      {loading && <p className="text-center text-muted">Đang tìm kiếm...</p>}

      {!loading && results.length === 0 && query.trim() !== "" && (
        <p className="text-center text-muted mt-3">Không tìm thấy người dùng nào.</p>
      )}

      <div className="d-flex flex-column gap-2">
        {results.map((user) => (
          <UserSearch
            key={user._id}
            profilePic={user.profilePic}
            username={user.username}
            fullname={user.fullname}
          />
        ))}
      </div>
    </div>
  );
}
