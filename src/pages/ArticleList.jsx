import React, { useState } from "react";
import { List, Select, Tag } from "antd";
import Header from "../components/Header";
import { useGetAllArticleQuery } from "../slices/articleApiSlice";
import Loading from "../components/Loading";
import Search from "antd/es/input/Search";
import "../styles/ArticleList.css";
import img from "../assets/no-result-data.webp";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";

const ArticleListPages = () => {
  const [searchCategory, setSearchCategory] = useState("judul");
  const [searchText, setSearchText] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  const searchTerm = (
    <Select
      defaultValue="judul"
      onChange={setSearchCategory}
      value={searchCategory}
      style={{
        minWidth: "84px",
      }}>
      <Select.Option value="title">judul</Select.Option>
      <Select.Option value="content">isi</Select.Option>
      <Select.Option value="author">penulis</Select.Option>
      <Select.Option value="tags">tag</Select.Option>
    </Select>
  );

  const { data, error, isLoading } = useGetAllArticleQuery();

  if (isLoading) return <Loading />;
  if (error)
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Data artikel tidak ditemukan",
    }).then(() => {
      window.location.href = "/";
    });

  const articleList = data?.map((item) => ({
    id: item.id_artikel,
    title: item.judul,
    author: item.penulis,
    createdAt: item.created_at,
    tags:
      item.tags
        .join("")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag) || [],
    content: item.isi,
    gambar: item.gambar,
  }));

  const onSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredArticles([]);
      return;
    }

    const filtered = articleList.filter((item) => {
      if (searchCategory === "judul") {
        return item.title.toLowerCase().includes(value.toLowerCase());
      }
      if (searchCategory === "content") {
        return item.content.toLowerCase().includes(value.toLowerCase());
      }
      if (searchCategory === "author") {
        return item.author.toLowerCase().includes(value.toLowerCase());
      }
      if (searchCategory === "tags") {
        return item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()));
      }
      return false;
    });

    setFilteredArticles(filtered);
  };

  const formatWaktu = (createdAt, author) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) {
      const tanggal = created.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const jam = created.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      });
      return `${author} · ${tanggal} · ${jam} WIB`;
    } else if (diffHours >= 1) {
      return `${author} · ${diffHours} jam yang lalu`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${author} · ${diffMinutes} menit yang lalu`;
    }
  };

  return (
    <div>
      <Header />
      <InstallButton />
      <div style={{ marginTop: "20px", marginInline: "10%", paddingBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "end", margin: "20px 0" }}>
          <Search
            addonBefore={searchTerm}
            placeholder="Cari artikel..."
            allowClear
            enterButton
            onSearch={onSearch}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "8px",
            }}
          />
        </div>

        <List
          itemLayout="vertical"
          size="large"
          style={{ gap: "20px" }}
          pagination={{
            pageSize: 10,
            style: { justifyContent: "center" },
          }}
          dataSource={filteredArticles.length > 0 || searchText ? filteredArticles : articleList}
          locale={{
            emptyText: (
              <div style={{ textAlign: "center", color: "#999" }}>
                <img
                  src={img}
                  alt="No results"
                  style={{ width: 220, marginBottom: 16, opacity: 0.5 }}
                />
                <div style={{ fontSize: "16px", fontWeight: 500 }}>{searchText && filteredArticles.length === 0 ? "Tidak ada artikel yang cocok" : "Belum ada artikel"}</div>
              </div>
            ),
          }}
          renderItem={(item) => (
            <List.Item
              key={item.judul}
              actions={[
                <span
                  key="meta"
                  style={{ fontSize: "14px", color: "#888" }}>
                  {formatWaktu(item.createdAt, item.author)}
                </span>,
              ]}
              extra={
                <img
                  width={272}
                  alt={`Artikel ${item.judul}`}
                  src={import.meta.env.VITE_API_URL + item.gambar}
                />
              }>
              <List.Item.Meta
                title={<a href={`/article/${item.id}`}>{item.title}</a>}
                description={item.tags.map((tag) => (
                  <Tag
                    key={tag}
                    color="cyan"
                    style={{ margin: "2px" }}>
                    #{tag}
                  </Tag>
                ))}
              />
              {item.content.length > 400 ? item.content.slice(0, 400) + "..." : item.content}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ArticleListPages;
