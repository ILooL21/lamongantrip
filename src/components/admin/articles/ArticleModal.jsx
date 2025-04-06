import PropTypes from "prop-types";
import { useCreateArticleMutation, useGetArticleByIdMutation, useUpdateArticleMutation } from "../../../slices/articleApiSlice";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Select, Input, Radio, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";

const ArticleModal = ({ isDetailModal, isEditModal, isAddModal, id_artikel, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_artikel: "",
    gambar: null,
    judul: "",
    isi: "",
    tipe: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [getArticleById] = useGetArticleByIdMutation();
  const [createArticleData, { isLoading: loadingCreateArticle }] = useCreateArticleMutation();
  const [updateArticleData, { isLoading: loadingUpdateArticle }] = useUpdateArticleMutation();

  const formArticleData = useMemo(() => {
    const data = new FormData();
    data.append("id_artikel", formData.id_artikel);
    data.append("gambar", formData.gambar);
    data.append("judul", formData.judul);
    data.append("isi", formData.isi);
    data.append("tipe", formData.tipe);
    data.append("tags", JSON.stringify(formData.tags));

    return data;
  }, [formData]);

  // Fetch data jika modal detail atau edit dibuka
  useEffect(() => {
    showModal();
    if ((isDetailModal || isEditModal) && id_artikel) {
      const fetchData = async () => {
        try {
          await getArticleById({ id: id_artikel })
            .unwrap()
            .then((res) => {
              setFormData({
                id_artikel: res.id_artikel || "",
                gambar: res.gambar || "",
                penulis: res.penulis || "",
                judul: res.judul || "",
                isi: res.isi || "",
                tipe: res.tipe || "",
                tags:
                  res.tags
                    .join("")
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag) || [],
              });
              setLoading(false);
            });
        } catch (error) {
          console.error("Error fetching article data:", error);
        }
      };

      fetchData();
    }
    setLoading(false);
  }, [getArticleById, isDetailModal, isEditModal, isAddModal, id_artikel]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose(); // Memberi tahu induk bahwa modal ditutup
  };

  const options = [
    {
      label: "Promo",
      value: "Promo",
    },
    {
      label: "Berita",
      value: "Berita",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];

      if (file) {
        setPreviewImage(URL.createObjectURL(file)); // Simpan URL gambar baru
      }

      setFormData((prev) => ({
        ...prev,
        [name]: e.target.files[0], // Menyimpan file sebagai objek File
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tipe: e.target.value,
    }));
  };

  const createArticleHandler = async () => {
    if (!formData.gambar || !formData.judul || !formData.isi || !formData.tipe || formData.tags.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan artikel",
        text: "Pastikan semua kolom telah diisi",
      });
      return;
    }

    try {
      const res = await createArticleData(formArticleData);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Artikel berhasil ditambahkan",
        }).then((isConfirmed) => {
          if (isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const updateArticleHandler = async () => {
    if (!formData.judul || !formData.isi || !formData.tipe || formData.tags.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan artikel",
        text: "Pastikan semua kolom telah diisi",
      });
      return;
    }

    if (typeof formData.gambar === "string") {
      formArticleData.delete("gambar");
    }

    try {
      const res = await updateArticleData(formArticleData);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Artikel berhasil diperbarui",
        }).then((isConfirmed) => {
          if (isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  return (
    <Modal
      title={isDetailModal ? "Detail Artikel" : isEditModal ? "Edit Artikel" : "Tambah Artikel"}
      open={isModalOpen}
      onCancel={handleCancel}
      loading={loading}
      centered
      style={{ top: 5 }}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={[
        isEditModal ? (
          <Button
            key="submit"
            type="primary"
            onClick={updateArticleHandler}
            loading={loadingUpdateArticle}>
            {loadingUpdateArticle ? "Loading..." : "Simpan"}
          </Button>
        ) : isAddModal ? (
          <Button
            key="submit"
            type="primary"
            onClick={createArticleHandler}
            loading={loadingCreateArticle}>
            {loadingCreateArticle ? "Loading..." : "Tambah"}
          </Button>
        ) : null,
        <Button
          key="back"
          onClick={handleCancel}>
          Batal
        </Button>,
      ]}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form
            className="form"
            encType="multipart/form-data">
            <div className="form-group">
              <label>Gambar</label>
              {isDetailModal && formData.gambar ? (
                <img
                  src={import.meta.env.VITE_API_URL + formData.gambar}
                  alt={formData.judul}
                  id="old-img-preview"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ) : (
                <>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      id="img-preview"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  ) : (
                    formData.gambar && (
                      <img
                        src={import.meta.env.VITE_API_URL + formData.gambar}
                        alt="Old Preview"
                        id="old-img-preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    )
                  )}

                  <br />
                  <Input
                    type="file"
                    className="form-control"
                    name="gambar"
                    onChange={handleChange}
                  />
                </>
              )}
            </div>
            <div className="form-group">
              <label>Judul</label>
              {isDetailModal ? (
                <p>{formData.judul}</p>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                />
              )}
            </div>
            <div className="form-group">
              <label>Isi</label>
              <TextArea
                rows={4}
                className="form-control"
                name="isi"
                value={formData.isi}
                onChange={handleChange}
                readOnly={isDetailModal}
              />
            </div>
            <div className="form-group">
              <label>Tipe</label>
              {isDetailModal ? (
                <p>{formData.tipe}</p>
              ) : (
                <Radio.Group
                  options={options}
                  onChange={handleRadioChange}
                  value={formData.tipe}
                  name="tipe"
                />
              )}
            </div>
            <div className="form-group">
              <label>Tags</label>
              {isDetailModal ? (
                formData.tags.map((tag) => (
                  <Tag
                    key={tag}
                    color="#87c0cd"
                    style={{ margin: "2px" }}>
                    {tag}
                  </Tag>
                ))
              ) : (
                <>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Tambah Tags"
                    onChange={(value) => setFormData((prev) => ({ ...prev, tags: value }))}
                    value={formData.tags}
                  />
                  <small>* jika menginputkan yang sama tag akan terhapus</small>
                </>
              )}
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

ArticleModal.propTypes = {
  isDetailModal: PropTypes.bool,
  isEditModal: PropTypes.bool,
  isAddModal: PropTypes.bool,
  id_artikel: PropTypes.number,
  onClose: PropTypes.func,
};

export default ArticleModal;
