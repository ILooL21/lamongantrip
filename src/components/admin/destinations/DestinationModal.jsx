import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Input, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import { useCreateDestinationMutation, useGetDestinationByIdMutation, useUpdateDestinationMutation } from "../../../slices/destinationApiSlice";
import { FacebookFilled, InstagramOutlined, TikTokOutlined, XOutlined, YoutubeFilled } from "@ant-design/icons";
import DefaultEditor, { createButton } from "react-simple-wysiwyg";

const DestinationModal = ({ isDetailModal, isEditModal, isAddModal, id_destination, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_tempat_wisata: "",
    deskripsi: "",
    nama_tempat: "",
    alamat: "",
    latitude: "",
    longitude: "",
    jenis: "",
    deskripsi_tiket: "",
    link_tiket: "",
    sosmed: {
      instagram: "",
      facebook: "",
      twitter: "",
      tiktok: "",
      youtube: "",
    },
    gambar: null,
  });
  const [loading, setLoading] = useState(false); // Initialize as false
  const [previewImage, setPreviewImage] = useState(null);

  // Tombol untuk H1
  const BtnH1 = createButton("H1", "H1", "formatBlock");
  // Tombol untuk H2
  const BtnH2 = createButton("H2", "H2", "formatBlock");
  // Tombol untuk H3
  const BtnH3 = createButton("H3", "H3", "formatBlock");

  const [getDestinationById] = useGetDestinationByIdMutation();
  const [createDestinationData, { isLoading: createDestinationDataLoading }] = useCreateDestinationMutation();
  const [updateDestinationData, { isLoading: updateDestinationDataLoading }] = useUpdateDestinationMutation();

  const formDestinationData = useMemo(() => {
    const data = new FormData();
    data.append("id_tempat_wisata", formData.id_tempat_wisata);
    data.append("nama_tempat", formData.nama_tempat);
    data.append("deskripsi", formData.deskripsi);
    data.append("alamat", formData.alamat);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("jenis", formData.jenis);
    data.append("deskripsi_tiket", formData.deskripsi_tiket);
    data.append("link_tiket", formData.link_tiket);
    data.append("sosmed", JSON.stringify(formData.sosmed));
    data.append("gambar", formData.gambar);
    return data;
  }, [formData]);

  // Fetch data for detail or edit modal
  useEffect(() => {
    setIsModalOpen(true); // Show modal immediately

    if ((isDetailModal || isEditModal) && id_destination) {
      setLoading(true); // Start loading
      const fetchData = async () => {
        try {
          const res = await getDestinationById({ id: id_destination }).unwrap();

          setFormData({
            id_tempat_wisata: res.id_tempat_wisata || "",
            gambar: res.gambar || "",
            deskripsi: res.deskripsi || "",
            nama_tempat: res.nama_tempat || "",
            alamat: res.alamat || "",
            latitude: res.latitude || "",
            longitude: res.longitude || "",
            jenis: res.jenis || "",
            deskripsi_tiket: res.deskripsi_tiket || "",
            link_tiket: res.link_tiket || "",
            sosmed: JSON.parse(res.sosmed) || {
              instagram: "",
              facebook: "",
              twitter: "",
              tiktok: "",
              youtube: "",
            },
          });
        } catch (error) {
          console.error("Error fetching destination data:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Tidak dapat memuat data tempat wisata",
          });
        } finally {
          setLoading(false); // Stop loading
        }
      };
      fetchData();
    } else {
      setLoading(false); // No loading for add modal
    }
  }, [isDetailModal, isEditModal, id_destination, getDestinationById]);

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const options = [
    { label: "Alam", value: "Alam" },
    { label: "Buatan", value: "Buatan" },
    { label: "Religi", value: "Religi" },
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
    } else if (name.startsWith("sosmed-")) {
      const platform = name.split("-")[1];
      setFormData((prev) => ({
        ...prev,
        sosmed: {
          ...prev.sosmed,
          [platform]: value,
        },
      }));
    } else if (name === "location") {
      const [latitude, longitude] = value.split(",");
      setFormData((prev) => ({
        ...prev,
        latitude: latitude ? latitude.trim() : "",
        longitude: longitude ? longitude.trim() : "",
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
      jenis: e.target.value,
    }));
  };

  const createDestinationHandler = async () => {
    if (!formData.gambar || !formData.nama_tempat || !formData.deskripsi || !formData.jenis) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan tempat wisata",
        text: "Pastikan semua kolom telah diisi",
      });
      return;
    }
    try {
      await createDestinationData(formDestinationData).unwrap();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Tempat wisata berhasil ditambahkan",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error creating destination:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat menambahkan tempat wisata",
      });
    }
  };

  const updateDestinationHandler = async () => {
    if (!formData.nama_tempat || !formData.deskripsi || !formData.jenis) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui tempat wisata",
        text: "Pastikan semua kolom telah diisi",
      });
      return;
    }
    if (typeof formData.gambar === "string") {
      formDestinationData.delete("gambar");
    }
    try {
      await updateDestinationData(formDestinationData).unwrap();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Tempat wisata berhasil diperbarui",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error updating destination:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat memperbarui tempat wisata",
      });
    }
  };

  return (
    <Modal
      title={isDetailModal ? "Detail Tempat Wisata" : isEditModal ? "Edit Tempat Wisata" : "Tambah Tempat Wisata"}
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
            onClick={updateDestinationHandler}
            loading={updateDestinationDataLoading}
            disabled={updateDestinationDataLoading}>
            Simpan
          </Button>
        ) : isAddModal ? (
          <Button
            key="submit"
            type="primary"
            onClick={createDestinationHandler}
            loading={createDestinationDataLoading}
            disabled={createDestinationDataLoading}>
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
              alt={formData.nama_tempat}
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
          <label>Nama Tempat Wisata</label>
          {isDetailModal ? (
            <p>{formData.nama_tempat}</p>
          ) : (
            <Input
              type="text"
              className="form-control"
              name="nama_tempat"
              value={formData.nama_tempat}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="form-group">
          <label>Jenis</label>
          {isDetailModal ? (
            <p>{formData.jenis}</p>
          ) : (
            <Radio.Group
              options={options}
              onChange={handleRadioChange}
              value={formData.jenis}
              name="jenis"
            />
          )}
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          {isDetailModal ? (
            <div
              dangerouslySetInnerHTML={{ __html: formData.deskripsi }}
              style={{
                minHeight: "80px",
                maxHeight: "250px", // tambahkan ini
                overflowY: "auto",
              }}
            />
          ) : (
            <DefaultEditor
              value={formData.deskripsi}
              onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))}
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
          <label>Alamat</label>
          <TextArea
            rows={4}
            className="form-control"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            readOnly={isDetailModal}
          />
        </div>
        <div className="form-group">
          <label>Koordinat Lokasi (Latitude, Longitude)</label>
          {isDetailModal ? (
            <p>
              {formData.latitude}, {formData.longitude}
            </p>
          ) : (
            <>
              <Input
                type="text"
                className="form-control"
                name="location"
                value={`${formData.latitude}, ${formData.longitude}`}
                onChange={handleChange}
                placeholder="Masukkan Koordinat Lokasi (Latitude, Longitude)"
              />
              <small style={{ color: "gray" }}>
                Cari tempat di{" "}
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer">
                  Google Maps
                </a>{" "}
                dan salin koordinatnya
              </small>
            </>
          )}
        </div>
        <div className="form-group">
          <label>Pembelian Tiket Online</label>
          {isDetailModal ? (
            // apakah ada deskripsi tiket dan link tiket
            formData.deskripsi_tiket && formData.link_tiket ? (
              <div>
                <p>{formData.deskripsi_tiket || "Tidak ada deskripsi tiket"}</p>
                <p>
                  <a
                    href={formData.link_tiket}
                    target="_blank"
                    rel="noopener noreferrer">
                    {formData.link_tiket || "Belum ada link tiket"}
                  </a>
                </p>
              </div>
            ) : (
              <p>Tidak ada informasi tiket online</p>
            )
          ) : (
            <>
              <TextArea
                rows={4}
                className="form-control"
                name="deskripsi_tiket"
                value={formData.deskripsi_tiket}
                onChange={handleChange}
                placeholder="Deskripsi Tiket (Opsional)"
              />
              <Input
                type="text"
                className="form-control"
                name="link_tiket"
                value={formData.link_tiket}
                style={{ marginTop: "10px" }}
                onChange={handleChange}
                placeholder="Link Pembelian Tiket (Opsional)"
              />
            </>
          )}
        </div>
        <div className="form-group">
          <label>Sosial Media</label>
          {isDetailModal ? (
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {
                // jika semua akun sosial media kosong, tampilkan pesan
                Object.values(formData.sosmed).every((link) => !link) ? (
                  <p>Tidak ada akun sosial media yang tersedia</p>
                ) : (
                  <>
                    {formData.sosmed.instagram && (
                      <a
                        href={formData.sosmed.instagram}
                        target="_blank"
                        rel="noopener noreferrer">
                        <InstagramOutlined style={{ fontSize: "20px", color: "#C13584" }} />
                      </a>
                    )}
                    {formData.sosmed.facebook && (
                      <a
                        href={formData.sosmed.facebook}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FacebookFilled style={{ fontSize: "20px", color: "#4267B2" }} />
                      </a>
                    )}
                    {formData.sosmed.twitter && (
                      <a
                        href={formData.sosmed.twitter}
                        target="_blank"
                        rel="noopener noreferrer">
                        <XOutlined style={{ fontSize: "20px", color: "black" }} />
                      </a>
                    )}
                    {formData.sosmed.youtube && (
                      <a
                        href={formData.sosmed.youtube}
                        target="_blank"
                        rel="noopener noreferrer">
                        <YoutubeFilled style={{ fontSize: "20px", color: "#FF0000" }} />
                      </a>
                    )}
                    {formData.sosmed.tiktok && (
                      <a
                        href={formData.sosmed.tiktok}
                        target="_blank"
                        rel="noopener noreferrer">
                        <TikTokOutlined style={{ fontSize: "20px", color: "black" }} />
                      </a>
                    )}
                  </>
                )
              }
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Input
                addonBefore={<InstagramOutlined style={{ fontSize: "20px", color: "#E1306C" }} />}
                className="form-control"
                name="sosmed-instagram"
                value={formData.sosmed.instagram}
                onChange={handleChange}
                placeholder="Masukkan Link Akun Instagram Tempat Wisata"
              />
              <Input
                addonBefore={<FacebookFilled style={{ fontSize: "20px", color: "#4267B2" }} />}
                className="form-control"
                name="sosmed-facebook"
                value={formData.sosmed.facebook}
                onChange={handleChange}
                placeholder="Masukkan Link Akun Facebook Tempat Wisata"
              />
              <Input
                addonBefore={<XOutlined style={{ fontSize: "20px", color: "black" }} />}
                className="form-control"
                name="sosmed-twitter"
                value={formData.sosmed.twitter}
                onChange={handleChange}
                placeholder="Masukkan Link Akun Twitter Tempat Wisata"
              />
              <Input
                addonBefore={<YoutubeFilled style={{ fontSize: "20px", color: "#FF0000" }} />}
                className="form-control"
                name="sosmed-youtube"
                value={formData.sosmed.youtube}
                onChange={handleChange}
                placeholder="Masukkan Link Akun Youtube Tempat Wisata"
              />
              <Input
                addonBefore={<TikTokOutlined style={{ fontSize: "20px", color: "black" }} />}
                className="form-control"
                name="sosmed-tiktok"
                value={formData.sosmed.tiktok}
                onChange={handleChange}
                placeholder="Masukkan Link Akun TikTok Tempat Wisata"
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

DestinationModal.propTypes = {
  isDetailModal: PropTypes.bool,
  isEditModal: PropTypes.bool,
  isAddModal: PropTypes.bool,
  id_destination: PropTypes.number,
  onClose: PropTypes.func,
};

export default DestinationModal;
