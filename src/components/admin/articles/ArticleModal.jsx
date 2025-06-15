import PropTypes from "prop-types";
import { useCreateArticleMutation, useGetArticleByIdMutation, useUpdateArticleMutation } from "../../../slices/articleApiSlice";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Select, Input, Radio, Tag } from "antd";
import Swal from "sweetalert2";
import DefaultEditor, { createButton } from "react-simple-wysiwyg";

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
  const [loading, setLoading] = useState(false); // Initialize as false
  const [previewImage, setPreviewImage] = useState(null);

  // Tombol untuk H1
  const BtnH1 = createButton("H1", "H1", "formatBlock");
  // Tombol untuk H2
  const BtnH2 = createButton("H2", "H2", "formatBlock");
  // Tombol untuk H3
  const BtnH3 = createButton("H3", "H3", "formatBlock");

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

  // Fetch data for detail or edit modal
  useEffect(() => {
    setIsModalOpen(true); // Show modal immediately

    if ((isDetailModal || isEditModal) && id_artikel) {
      setLoading(true); // Start loading
      const fetchData = async () => {
        try {
          const res = await getArticleById({ id: id_artikel }).unwrap();
          setFormData({
            id_artikel: res[0].id_artikel || "",
            gambar: res[0].gambar || "",
            penulis: res[0].penulis || "",
            judul: res[0].judul || "",
            isi: res[0].isi || "",
            tipe: res[0].tipe || "",
            tags:
              res[0].tags
                .join("")
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag) || [],
          });
        } catch (error) {
          console.error("Error fetching article data:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Tidak dapat memuat data artikel",
          });
        } finally {
          setLoading(false); // Stop loading regardless of success or failure
        }
      };

      fetchData();
    } else {
      setLoading(false); // No loading for add modal
    }
  }, [getArticleById, isDetailModal, isEditModal, isAddModal, id_artikel]);

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const options = [
    { label: "Promo", value: "Promo" },
    { label: "Berita", value: "Berita" },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
      setFormData((prev) => ({
        ...prev,
        [name]: file,
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
        }).then((result) => {
          if (result.isConfirmed) {
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
        title: "Gagal memperbarui artikel",
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
        }).then((result) => {
          if (result.isConfirmed) {
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
      centered
      loading={loading}
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
            Simpan
          </Button>
        ) : isAddModal ? (
          <Button
            key="submit"
            type="primary"
            onClick={createArticleHandler}
            loading={loadingCreateArticle}>
            Tambah
          </Button>
        ) : null,
        <Button
          key="back"
          onClick={handleCancel}>
          Batal
        </Button>,
      ]}>
      <form
        className="form"
        encType="multipart/form-data">
        <div className="form-group">
          <label>Gambar</label>
          {isDetailModal && formData.gambar ? (
            <img
              src={import.meta.env.VITE_API_URL + formData.gambar}
              alt={formData.judul}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <>
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ) : (
                formData.gambar && (
                  <img
                    src={import.meta.env.VITE_API_URL + formData.gambar}
                    alt="Old Preview"
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
                disabled={isDetailModal}
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
          {isDetailModal ? (
            <div
              dangerouslySetInnerHTML={{ __html: formData.isi }}
              style={{
                minHeight: "80px",
                maxHeight: "250px", // tambahkan ini
                overflowY: "auto",
              }}
            />
          ) : (
            <DefaultEditor
              value={formData.isi}
              onChange={(e) => setFormData((prev) => ({ ...prev, isi: e.target.value }))}
              toolbar={{
                options: ["inline", "blockType", "list", "textAlign", "link"],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline"],
                },
                blockType: {
                  inDropdown: false,
                  options: ["Normal", "H1", "H2", "H3"],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
                list: {
                  inDropdown: false,
                  options: ["unordered", "ordered"],
                },
                textAlign: {
                  inDropdown: false,
                  options: ["left", "center", "right"],
                },
                link: {
                  inDropdown: false,
                },
              }}
              customButtons={[BtnH1, BtnH2, BtnH3]}
              readOnly={isDetailModal}
              className="form-control"
              style={{
                minHeight: "80px",
                maxHeight: "250px", // tambahkan ini
                overflowY: "auto",
              }}
            />
          )}
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
