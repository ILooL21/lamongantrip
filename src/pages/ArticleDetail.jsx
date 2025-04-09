import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useGetArticleByIdMutation } from "../slices/articleApiSlice";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import "../styles/ArticleDetail.css"; // Tambahkan CSS ini
import InstallButton from "../components/InstallButton";

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
      <div className="article-content">
        <h1 className="article-title">{data.judul}</h1>
        <p className="article-author">Ditulis oleh {data.penulis}</p>
        <p className="article-meta">{formatWaktu(data.created_at)}</p>

        {data.gambar && (
          <img
            src={import.meta.env.VITE_API_URL + data.gambar}
            alt="Gambar Artikel"
            className="article-image"
          />
        )}

        <div className="article-body">{data.isi}</div>

        {data.tags.length > 0 && (
          <div className="article-tags">
            <h3>Tags:</h3>
            <ul>
              {data.tags.map((tag, index) => (
                <li
                  key={index}
                  className="tag-item">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPages;
