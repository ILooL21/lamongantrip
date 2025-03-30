import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import { Breadcrumb } from "antd";
import { useDeleteArticleMutation, useGetAllArticleQuery } from "../../slices/articleApiSlice";
import ArticleModal from "../../components/admin/articles/ArticleModal";
import Swal from "sweetalert2";
import Search from "antd/es/input/Search";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const ArticleManagementPages = () => {
  const [listArticles, setListArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategories, setSearchCategories] = useState("judul");
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const { data: articleData, isLoading: loadingGetArticle } = useGetAllArticleQuery();
  const [deleteArticle, { isLoading: loadingDeleteArticle, error: errorDeleteArticle }] = useDeleteArticleMutation();

  useEffect(() => {
    if (!loadingGetArticle && articleData) {
      setListArticles(articleData);
    }
  }, [articleData, loadingGetArticle]);

  const handleDeleteArticle = async (id) => {
    let id_artikel = parseInt(id);

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Artikel yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteArticle({ id: id_artikel }).unwrap();

          if (!loadingDeleteArticle) {
            if (res) {
              Swal.fire("Berhasil", "Artikel berhasil dihapus", "success").then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire("Gagal", errorDeleteArticle, "error");
            }
          }
        } catch (e) {
          Swal.fire("Gagal", e, "error");
        }
      }
    });
  };

  // Fungsi untuk membuka modal
  const openModal = (type, articleId = null) => {
    setModalType(type);
    setSelectedArticleId(articleId);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedArticleId(null);
  };

  const renderRowTable = () => {
    return listArticles
      .filter((article) => article[searchCategories].toLowerCase().includes(searchTerm.toLowerCase()))
      .map((article, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {article.gambar ? (
              <img
                src={import.meta.env.VITE_API_URL + article.gambar}
                alt={article.judul}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <p>Tidak ada gambar</p>
            )}
          </td>
          <td>{article.penulis}</td>
          <td>{article.judul}</td>
          <td>{article.isi}</td>  
          <td>
            <button
              className="btn btn-info"
              onClick={() => openModal("detail", article.id_artikel)}
              title="Detail">
              <EyeOutlined />
            </button>
            <button
              className="btn btn-warning"
              onClick={() => openModal("edit", article.id_artikel)}
              title="Edit">
              <EditOutlined />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteArticle(article.id_artikel)}
              title="Delete">
              <DeleteOutlined />
            </button>
          </td>
        </tr>
      ));
  };

  return (
    <div>
      <Header />
      <div
        className="wrapper-body"
        style={{ display: "flex" }}>
        <Sidebar activeMenu={"articles"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[{ title: <a href="/admin/dashboard">Home</a> }, { title: "Artikel" }]}
            />
          </div>
          <div className="container-dashboard-body">
            <h1>Table Data Artikel</h1>
            <div style={{ display: "flex", marginBottom: "20px", justifyContent: "space-between" }}>
              <button
                className="btn btn-primary"
                onClick={() => openModal("add")}>
                Tambah Artikel
              </button>
              <div className="search-bar">
                <select
                  id="search"
                  className="form-control search-bar-select"
                  onChange={(e) => setSearchCategories(e.target.value)}>
                  <option value="judul">Judul</option>
                  <option value="penulis">Penulis</option>
                  <option value="isi">Isi</option>
                </select>
                <Search
                  placeholder="Cari Artikel"
                  value={searchTerm}
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>gambar</th>
                    <th>Penulis</th>
                    <th>Judul</th>
                    <th>Isi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetArticle ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center" }}>
                        Loading...
                      </td>
                    </tr>
                  ) : renderRowTable().length > 0 ? (
                    renderRowTable()
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center" }}>
                        Tidak ada data artikel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ArticleModal
          isDetailModal={modalType === "detail"}
          isEditModal={modalType === "edit"}
          isAddModal={modalType === "add"}
          id_artikel={selectedArticleId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ArticleManagementPages;
