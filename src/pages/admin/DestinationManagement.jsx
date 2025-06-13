import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import Search from "antd/es/input/Search";
import { Breadcrumb } from "antd";
import { useDeleteDestinationMutation, useGetAllDestinationsQuery } from "../../slices/destinationApiSlice";
import DestinationModal from "../../components/admin/destinations/DestinationModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const DestinationManagementPages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listDestinations, setListDestinations] = useState([]);
  const [searchCategories, setSearchCategories] = useState("nama_tempat");
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);

  const { data: destinationData, isLoading: loadingGetDestination } = useGetAllDestinationsQuery();
  const [deleteDestination, { isLoading: loadingDeleteDestination, error: errorDeleteDestination }] = useDeleteDestinationMutation();

  useEffect(() => {
    if (!loadingGetDestination && destinationData) {
      setListDestinations(destinationData);
    }
  }, [destinationData, loadingGetDestination]);

  // Fungsi untuk membuka modal
  const openModal = (type, id = null) => {
    setModalType(type);
    setSelectedDestinationId(id);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedDestinationId(null);
  };

  const handleDeleteDestination = async (id) => {
    let id_destination = parseInt(id);
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
          const res = await deleteDestination({ id: id_destination }).unwrap();
          if (!loadingDeleteDestination) {
            if (res) {
              Swal.fire("Berhasil", "Artikel berhasil dihapus", "success").then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire("Gagal", errorDeleteDestination, "error");
            }
          }
        } catch (e) {
          Swal.fire("Gagal", e, "error");
        }
      }
    });
  };

  const renderRowTable = () => {
    return listDestinations
      .filter((destination) => destination[searchCategories].toLowerCase().includes(searchTerm.toLowerCase()))
      .map((destination, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {destination.gambar ? (
              <img
                src={import.meta.env.VITE_API_URL + destination.gambar}
                alt={destination.judul}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <p>Tidak ada gambar</p>
            )}
          </td>
          <td>{destination.nama_tempat}</td>
          <td>{destination.jenis}</td>
          <td>
            <div
              dangerouslySetInnerHTML={{ __html: destination.deskripsi }}
              style={{
                maxHeight: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            />
          </td>
          <td>{destination.alamat}</td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => openModal("detail", destination.id_tempat_wisata)}
              title="Detail">
              <EyeOutlined />
            </button>
            <button
              className="btn btn-warning"
              onClick={() => openModal("edit", destination.id_tempat_wisata)}
              title="Edit">
              <EditOutlined />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteDestination(destination.id_tempat_wisata)}
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
        <Sidebar activeMenu={"destinations"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[{ title: <a href="/admin/dashboard">Home</a> }, { title: "Tempat Wisata" }]}
            />
          </div>
          <div className="container-dashboard-body">
            <h1>Table Data Tempat Wisata</h1>
            <div style={{ display: "flex", marginBottom: "20px", justifyContent: "space-between" }}>
              <button
                className="btn btn-primary"
                onClick={() => openModal("add")}>
                Tambah Tempat Wisata
              </button>
              <div className="search-bar">
                <select
                  id="search"
                  className="form-control search-bar-select"
                  onChange={(e) => setSearchCategories(e.target.value)}>
                  <option value="nama_tempat">Nama</option>
                  <option value="jenis">Jenis</option>
                  <option value="deskripsi">Deskripsi</option>
                  <option value="alamat">Alamat</option>
                </select>
                <Search
                  placeholder="Cari Tempat Wisata"
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
                    <th>Gambar</th>
                    <th>Nama Tempat</th>
                    <th>Jenis</th>
                    <th>Deskripsi</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetDestination ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center" }}>
                        Loading...
                      </td>
                    </tr>
                  ) : renderRowTable().length > 0 ? (
                    renderRowTable()
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center" }}>
                        Tidak ada data tempat wisata.
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
        <DestinationModal
          isDetailModal={modalType === "detail"}
          isEditModal={modalType === "edit"}
          isAddModal={modalType === "add"}
          id_destination={selectedDestinationId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DestinationManagementPages;
