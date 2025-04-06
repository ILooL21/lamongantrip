import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Input, Radio, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import Swal from "sweetalert2";
import { useCreateDestinationMutation, useGetDestinationByIdMutation, useUpdateDestinationMutation } from "../../../slices/destinationApiSlice";
import { FacebookFilled, InstagramOutlined, TikTokOutlined, XOutlined, YoutubeFilled } from "@ant-design/icons";

const DestinationModal = ({ isDetailModal, isEditModal, isAddModal, id_destination, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_tempat_wisata: "",
    deskripsi: "",
    nama_tempat: "",
    alamat: "",
    jenis: "",
    tiket: {
      hari_kerja: {
        dewasa: 0,
        anak: 0,
      },
      hari_libur: {
        dewasa: 0,
        anak: 0,
      },
    },
    sosmed: {
      instagram: "",
      facebook: "",
      twitter: "",
      tiktok: "",
      youtube: "",
    },
    gambar: null,
  });
  const [ticketArray, setTicketArray] = useState([]);

  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [getDestinationById] = useGetDestinationByIdMutation();
  const [createDestinationData, { isLoading: createDestinationDataLoading }] = useCreateDestinationMutation();
  const [updateDestinationData, { isLoading: updateDestinationDataLoading }] = useUpdateDestinationMutation();

  const formDestinationData = useMemo(() => {
    const data = new FormData();
    data.append("id_tempat_wisata", formData.id_tempat_wisata);
    data.append("nama_tempat", formData.nama_tempat);
    data.append("deskripsi", formData.deskripsi);
    data.append("alamat", formData.alamat);
    data.append("jenis", formData.jenis);
    data.append("tiket", JSON.stringify(formData.tiket));
    data.append("sosmed", JSON.stringify(formData.sosmed));
    data.append("gambar", formData.gambar);

    return data;
  }, [formData]);

  // Fungsi untuk memformat nilai mata uang
  const formatCurrency = (value) => {
    if (value == null || value === "") return "Rp 0";

    // Jika sudah number, langsung pakai. Kalau bukan, ubah ke number.
    const numberValue = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""));

    return numberValue.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    showModal();
    if ((isDetailModal || isEditModal) && id_destination) {
      const fetchData = async () => {
        try {
          await getDestinationById({ id: id_destination })
            .unwrap()
            .then((res) => {
              let ticket_list = JSON.parse(res.tiket);

              setFormData({
                id_tempat_wisata: res.id_tempat_wisata || "",
                gambar: res.gambar || "",
                deskripsi: res.deskripsi || "",
                nama_tempat: res.nama_tempat || "",
                alamat: res.alamat || "",
                jenis: res.jenis || "",
                tiket: res.tiket
                  ? ticket_list
                  : {
                      hari_kerja: {
                        dewasa: "",
                        anak: "",
                      },
                      hari_libur: {
                        dewasa: "",
                        anak: "",
                      },
                    },
                sosmed: JSON.parse(res.sosmed) || {
                  instagram: "",
                  facebook: "",
                  twitter: "",
                  tiktok: "",
                  youtube: "",
                },
              });
              if (ticket_list) {
                setTicketArray([
                  {
                    key: "hari_kerja",
                    hari: "Hari Kerja",
                    dewasa: formatCurrency(ticket_list["hari_kerja"]["dewasa"]) || "",
                    anak: formatCurrency(ticket_list["hari_kerja"]["anak"]) || "",
                  },
                  {
                    key: "hari_libur",
                    hari: "Hari Libur",
                    dewasa: formatCurrency(ticket_list["hari_libur"]["dewasa"]) || "",
                    anak: formatCurrency(ticket_list["hari_libur"]["anak"]) || "",
                  },
                ]);
              }

              setLoading(false);
            });
        } catch (error) {
          console.error("Error fetching destination data:", error);
        }
      };
      fetchData();
    }
    setLoading(false);
  }, [isDetailModal, isEditModal, id_destination, getDestinationById]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose(); // Memberi tahu induk bahwa modal ditutup
  };

  const options = [
    {
      label: "Alam",
      value: "Alam",
    },
    {
      label: "Buatan",
      value: "Buatan",
    },
    {
      label: "Religi",
      value: "Religi",
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
    } else if (name.startsWith("sosmed-")) {
      const platform = name.split("-")[1];
      setFormData((prev) => ({
        ...prev,
        sosmed: {
          ...prev.sosmed,
          [platform]: value,
        },
      }));
    } else if (name.startsWith("tiket-")) {
      // hilangkan selain angka
      const value = e.target.value.replace(/\D/g, "");
      const name = e.target.name;

      const [day, ageGroup] = name.split("-").slice(1);
      setFormData((prev) => ({
        ...prev,
        tiket: {
          ...prev.tiket,
          [`hari_${day}`]: {
            ...prev.tiket[`hari_${day}`],
            [ageGroup]: value,
          },
        },
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
      const res = await createDestinationData(formDestinationData);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tempat wisata berhasil ditambahkan",
        }).then((isConfirmed) => {
          if (isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  const updateDestinationHandler = async () => {
    if (!formData.gambar || !formData.nama_tempat || !formData.deskripsi || !formData.jenis) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan tempat wisata",
        text: "Pastikan semua kolom telah diisi",
      });
      return;
    }

    if (typeof formData.gambar === "string") {
      formDestinationData.delete("gambar");
    }

    try {
      const res = await updateDestinationData(formDestinationData);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tempat Wisata berhasil diperbarui",
        }).then((isConfirmed) => {
          if (isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error updating destination:", error);
    }
  };

  return (
    <Modal
      title={isDetailModal ? "Detail Tempat Wisata" : isEditModal ? "Edit Tempat Wisata" : "Tambah Tempat Wisata"}
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
            onClick={updateDestinationHandler}
            disabled={updateDestinationDataLoading}>
            {updateDestinationDataLoading ? "Loading..." : "Simpan"}
          </Button>
        ) : isAddModal ? (
          <Button
            key="submit"
            type="primary"
            onClick={createDestinationHandler}
            disabled={createDestinationDataLoading}>
            {createDestinationDataLoading ? "Loading..." : "Tambah"}
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
                  alt={formData.nama_tempat}
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
              <label>Nama Tempat wisata</label>
              {isDetailModal ? (
                <p>{formData.nama_tempat}</p>
              ) : (
                <input
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
              <TextArea
                rows={4}
                className="form-control"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                readOnly={isDetailModal}
              />
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
              <label>Tiket</label>
              {isDetailModal ? (
                <Table
                  dataSource={ticketArray}
                  pagination={false}
                  rowKey="hari"
                  columns={[
                    {
                      title: "Hari",
                      dataIndex: "hari",
                      key: "hari",
                    },
                    {
                      title: "Harga Tiket Dewasa",
                      dataIndex: "dewasa",
                      key: "dewasa",
                    },
                    {
                      title: "Harga Tiket Anak-anak",
                      dataIndex: "anak",
                      key: "anak",
                    },
                  ]}
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label>Hari Kerja</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                      addonBefore="Dewasa"
                      className="form-control"
                      name="tiket-kerja-dewasa"
                      value={formData.tiket["hari_kerja"]["dewasa"]}
                      onChange={handleChange}
                      placeholder="Dewasa"
                    />
                    <Input
                      addonBefore="Anak - anak"
                      className="form-control"
                      name="tiket-kerja-anak"
                      value={formData.tiket["hari_kerja"]["anak"]}
                      onChange={handleChange}
                      placeholder="Anak-anak"
                    />
                  </div>
                  <label>Hari Libur</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                      addonBefore="Dewasa"
                      className="form-control"
                      name="tiket-libur-dewasa"
                      value={formData.tiket["hari_libur"]["dewasa"]}
                      onChange={handleChange}
                      placeholder="Dewasa"
                    />
                    <Input
                      addonBefore="Anak - anak"
                      className="form-control"
                      name="tiket-libur-anak"
                      value={formData.tiket["hari_libur"]["anak"]}
                      onChange={handleChange}
                      placeholder="Anak-anak"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Sosial Media</label>
              {isDetailModal ? (
                <>
                  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    {formData.sosmed["instagram"] && (
                      <a
                        href={formData.sosmed["instagram"]}
                        target="_blank"
                        rel="noopener noreferrer">
                        <InstagramOutlined style={{ fontSize: "20px", color: "#C13584" }} />
                      </a>
                    )}
                    {formData.sosmed["facebook"] && (
                      <a
                        href={formData.sosmed["facebook"]}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FacebookFilled style={{ fontSize: "20px", color: "#4267B2" }} />
                      </a>
                    )}
                    {formData.sosmed["twitter"] && (
                      <a
                        href={formData.sosmed["twitter"]}
                        target="_blank"
                        rel="noopener noreferrer">
                        <XOutlined style={{ fontSize: "20px", color: "black" }} />
                      </a>
                    )}
                    {formData.sosmed["youtube"] && (
                      <a
                        href={formData.sosmed["youtube"]}
                        target="_blank"
                        rel="noopener noreferrer">
                        <YoutubeFilled style={{ fontSize: "20px", color: "#FF0000" }} />
                      </a>
                    )}
                    {formData.sosmed["tiktok"] && (
                      <a
                        href={formData.sosmed["tiktok"]}
                        target="_blank"
                        rel="noopener noreferrer">
                        <TikTokOutlined style={{ fontSize: "20px", color: "black" }} />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Input
                    addonBefore={<InstagramOutlined style={{ fontSize: "20px", color: "#E1306C" }} />}
                    className="form-control"
                    name="sosmed-instagram"
                    value={formData.sosmed["instagram"]}
                    onChange={handleChange}
                    placeholder="Masukkan Link Akun Instagram Tempat Wisata"
                  />
                  <Input
                    addonBefore={<FacebookFilled style={{ fontSize: "20px", color: "#4267B2" }} />}
                    className="form-control"
                    name="sosmed-facebook"
                    value={formData.sosmed["facebook"]}
                    onChange={handleChange}
                    placeholder="Masukkan Link Akun Facebook Tempat Wisata"
                  />
                  <Input
                    addonBefore={<XOutlined style={{ fontSize: "20px", color: "black" }} />}
                    className="form-control"
                    name="sosmed-twitter"
                    value={formData.sosmed["twitter"]}
                    onChange={handleChange}
                    placeholder="Masukkan Link Akun Twitter Tempat Wisata"
                  />
                  <Input
                    addonBefore={<YoutubeFilled style={{ fontSize: "20px", color: "#FF0000" }} />}
                    className="form-control"
                    name="sosmed-youtube"
                    value={formData.sosmed["youtube"]}
                    onChange={handleChange}
                    placeholder="Masukkan Link Akun Youtube Tempat Wisata"
                  />
                  <Input
                    addonBefore={<TikTokOutlined style={{ fontSize: "20px", color: "black" }} />}
                    className="form-control"
                    name="sosmed-tiktok"
                    value={formData.sosmed["tiktok"]}
                    onChange={handleChange}
                    placeholder="Masukkan Link Akun TikTok Tempat Wisata"
                  />
                </div>
              )}
            </div>
          </form>
        </>
      )}
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
