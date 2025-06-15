import { useState } from "react";
import { Select, Tag, Pagination } from "antd";
import { SearchOutlined, CalendarOutlined, UserOutlined, TagOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useGetAllArticleQuery } from "../slices/articleApiSlice";
import Loading from "../components/Loading";
import "../styles/ArticleList.css";
import img from "../assets/no-result-data.webp";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";

const ArticleListPages = () => {
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

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

  // Tambahkan fungsi KECIL dan BARU ini di mana saja sebelum 'return'
  const handleTagClick = (tagValue) => {
    // 1. Atur state agar UI (input & select) ikut berubah
    setSearchCategory("tags");
    setSearchText(tagValue);

    // 2. Lakukan filter secara manual dan langsung dengan kategori yang benar
    const filtered = articleList.filter((item) => item.tags.some((tag) => tag.toLowerCase().includes(tagValue.toLowerCase())));

    // 3. Perbarui daftar artikel yang ditampilkan dan reset halaman
    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  // Re-filter when search category changes
  const handleCategoryChange = (value) => {
    setSearchCategory(value);
    if (searchText) {
      onSearch(searchText); // Re-run search with new category
    }
  };

  const onSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredArticles([]);
      return;
    }

    const filtered = articleList.filter((item) => {
      const searchValue = value.toLowerCase();

      switch (searchCategory) {
        case "title":
          return item.title.toLowerCase().includes(searchValue);
        case "content":
          return item.content.toLowerCase().includes(searchValue);
        case "author":
          return item.author.toLowerCase().includes(searchValue);
        case "tags":
          return item.tags.some((tag) => tag.toLowerCase().includes(searchValue));
        case "all":
        default:
          return item.title.toLowerCase().includes(searchValue) || item.content.toLowerCase().includes(searchValue) || item.author.toLowerCase().includes(searchValue) || item.tags.some((tag) => tag.toLowerCase().includes(searchValue));
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const formatWaktu = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) {
      return created.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else if (diffHours >= 1) {
      return `${diffHours} jam yang lalu`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} menit yang lalu`;
    }
  };

  return (
    <div className="article-list-page">
      <Header />
      <InstallButton />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Berita & Pembaruan</h1>
            <p className="hero-subtitle">Lamongan, kota pariwisata di Jawa Timur, menawarkan keragaman pengalaman yang tidak akan pernah Anda lupakan. Apa saja berita dan informasi terbaru tentang Lamongan?</p>
          </div>

          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-container">
              <div className="search-bar-flat">
                <Select
                  value={searchCategory}
                  onChange={handleCategoryChange}
                  className="search-category-flat"
                  size="middle"
                  style={{ minWidth: 120 }}>
                  <Select.Option value="all">Semua</Select.Option>
                  <Select.Option value="title">Judul</Select.Option>
                  <Select.Option value="content">Konten</Select.Option>
                  <Select.Option value="author">Penulis</Select.Option>
                  <Select.Option value="tags">Tag</Select.Option>
                </Select>
                <input
                  type="search"
                  className="custom-search-flat"
                  placeholder="Cari artikel..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    onSearch(e.target.value); // Filter as user types
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSearch(searchText);
                    }
                  }}
                />
                <button
                  type="button"
                  className="filter-flat-btn">
                  <SearchOutlined style={{ fontSize: 18, marginRight: 6 }} /> Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="articles-section">
        <div className="articles-container">
          {/* Article Grid */}
          <div className="articles-grid">
            {(filteredArticles.length > 0 || searchText ? filteredArticles : articleList).slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
              <div
                key={item.id}
                className="article-card">
                <div className="article-image">
                  <img
                    src={import.meta.env.VITE_API_URL + item.gambar}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = img;
                    }}
                  />
                  <div className="article-overlay">
                    <a
                      href={`/article/${item.id}`}
                      className="read-more-btn">
                      Baca Selengkapnya
                    </a>
                  </div>
                </div>

                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-author">
                      <UserOutlined /> {item.author}
                    </span>
                    <span className="article-date">
                      <CalendarOutlined /> {formatWaktu(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="article-title">
                    <a href={`/article/${item.id}`}>{item.title}</a>
                  </h3>

                  <div className="article-tags">
                    <TagOutlined className="tags-icon" />
                    {item.tags.slice(0, 3).map((tag) => (
                      <Tag
                        key={tag}
                        className="article-tag"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleTagClick(tag)}>
                        {tag}
                      </Tag>
                    ))}
                    {item.tags.length > 3 && <span className="more-tags">+{item.tags.length - 3}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {((filteredArticles.length === 0 && searchText) || (!searchText && articleList.length === 0)) && (
            <div className="no-results">
              <img
                src={img}
                alt="No results"
                className="no-results-image"
              />
              <h3 className="no-results-title">{searchText && filteredArticles.length === 0 ? "Tidak ada artikel yang cocok" : "Belum ada artikel"}</h3>
              <p className="no-results-text">{searchText ? "Coba ubah kata kunci pencarian Anda" : "Artikel akan segera tersedia"}</p>
            </div>
          )}

          {/* Pagination */}
          {(filteredArticles.length > 0 || (!searchText && articleList.length > 0)) && (
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredArticles.length > 0 || searchText ? filteredArticles.length : articleList.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} artikel`}
                className="articles-pagination"
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleListPages;
