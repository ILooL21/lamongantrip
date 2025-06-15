import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useGetArticleByIdMutation } from "../slices/articleApiSlice";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import "../styles/ArticleDetail.css";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";
import { CalendarOutlined, UserOutlined, TagOutlined } from "@ant-design/icons";

const ArticleDetailPages = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    id_artikel: "",
    judul: "",
    penulis: "",
    isi: "",
    created_at: "",
    gambar: "",
    tags: [],
  });

  const [getArticleData, { isLoading, error }] = useGetArticleByIdMutation();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getArticleData({ id }).unwrap();
          setData({
            id_artikel: response[0].id_artikel,
            judul: response[0].judul,
            penulis: response[0].penulis,
            isi: response[0].isi,
            created_at: response[0].created_at,
            gambar: response[0].gambar,
            tags: response[0].tags
              .join("")
              .split(",")
              .map((tag) => tag.trim()),
          });
        } catch (error) {
          console.error("Error fetching article data:", error);
        }
      };
      fetchData();
    }
  }, [id, getArticleData]);

  //   hari,tanggal | jam WIB
  const formatWaktu = (createdAt) => {
    const created = new Date(createdAt);
    const hari = created.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const jam = created.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    });
    return `${hari} | ${jam} WIB`;
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div>
        <Header />
        <div className="error-message">
          <h2>Gagal memuat artikel</h2>
          <p>Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="article-detail-container">
      <Header />
      <InstallButton />

      {/* Hero Section with Article Image */}
      {data.gambar && (
        <div
          className="article-hero"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,127,115,0.3), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_API_URL + data.gambar})`,
          }}></div>
      )}

      <div className="article-card-container">
        {/* Single Card for All Article Content */}
        <div className="article-card">
          {/* Article Header */}
          <div className="article-header">
            <h1 className="article-detail-title">{data.judul}</h1>
            <div className="article-meta">
              <div className="article-date">
                <CalendarOutlined /> {formatWaktu(data.created_at)}
              </div>
              <div className="article-author">
                <UserOutlined /> {data.penulis}
              </div>
            </div>
          </div>

          {/* Article Image (Kept inside card as well) */}
          {data.gambar && (
            <div className="article-image-wrapper">
              <img
                src={import.meta.env.VITE_API_URL + data.gambar}
                alt="Gambar Artikel"
                className="article-image"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: data.isi }}
          />

          {/* Article Tags */}
          {data.tags.length > 0 && (
            <div className="article-detail-tags">
              <TagOutlined
                style={{ color: "#007f73", marginRight: "10px" }}
                className="tag-icon"
              />
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-item">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleDetailPages;
