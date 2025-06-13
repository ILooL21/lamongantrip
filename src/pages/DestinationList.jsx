import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col } from "antd";
import img from "../assets/no-result-data.webp";

import Swal from "sweetalert2";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { useGetAllDestinationsQuery } from "../slices/destinationApiSlice";
import "../styles/DestinationList.css";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";

const DestinationListPages = () => {
  const { jenis } = useParams();
  const { data, error, isLoading } = useGetAllDestinationsQuery();

  useEffect(() => {
    if (!jenis) {
      document.title = "Daftar Semua Tujuan Wisata";
    } else if (["religi", "alam", "buatan"].includes(jenis)) {
      document.title = `Daftar Tujuan Wisata ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}`;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Halaman tidak ditemukan",
      }).then(() => {
        window.location.href = "/destination";
      });
    }
  }, [jenis]);

  if (isLoading) return <Loading />;

  if (error || !data) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Data Tempat Wisata tidak ditemukan",
    }).then(() => {
      window.location.href = "/destination";
    });
    return null;
  }

  const filteredDestinations = jenis ? data.filter((item) => item.jenis.toLowerCase() === jenis.toLowerCase()) : data;

  const capitalizeEachFirstLetter = (val) => {
    return val.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formattingNameLinkDestinations = (val) => {
    return val.replace(/-/g, "_").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div>
      <Header />
      <InstallButton />
      <div className="destination-page-title">
        <h1>{jenis ? `Tempat Wisata ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}` : "Semua Tempat Wisata"}</h1>
      </div>
      <div className="container-destination-list">
        {filteredDestinations.length === 0 ? (
          <div
            className="no-data"
            style={{ textAlign: "center", color: "#999" }}>
            <img
              src={img}
              alt="No results"
              style={{ width: 220, marginBottom: 16, opacity: 0.5 }}
            />
            <h2>Tidak ada data tujuan wisata</h2>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredDestinations.map((item) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={item.id_tempat_wisata}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.nama_tempat}
                      src={`${import.meta.env.VITE_API_URL}${item.gambar}`}
                      className="card-image"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                  onClick={() => (window.location.href = `/destination/detail/${formattingNameLinkDestinations(item.nama_tempat)}`)}>
                  <h3>{capitalizeEachFirstLetter(item.nama_tempat)}</h3>
                  {!jenis && <p>Wisata {capitalizeEachFirstLetter(item.jenis)}</p>}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DestinationListPages;
