import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col } from "antd";

import Swal from "sweetalert2";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { useGetAllDestinationsQuery } from "../slices/destinationApiSlice";
import "../styles/DestinationList.css";
import InstallButton from "../components/InstallButton";

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

  // buat nama_tempat waduk-gondang
  const formattingNameLinkDestinations = (val) => {
    return val.replace(/\s+/g, "-").toLowerCase();
  };

  return (
    <div>
      <Header />
      <InstallButton />
      <div className="destination-page-title">
        <h1>{jenis ? `Tempat Wisata ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}` : "Semua Tempat Wisata"}</h1>
      </div>
      <div className="container-destination-list">
        <Row gutter={[16, 16]}>
          {filteredDestinations.map((item) => (
            <Col
              key={item.id_tempat_wisata}
              xs={24}
              sm={12}
              md={12}
              lg={6}
              xl={6}>
              <Card
                hoverable
                className="destination-card"
                onClick={() => (window.location.href = `/destination/detail/${formattingNameLinkDestinations(item.nama_tempat)}`)}
                cover={
                  <img
                    alt={item.nama_tempat}
                    src={import.meta.env.VITE_API_URL + item.gambar}
                    className="destination-image"
                  />
                }>
                <Card.Meta
                  title={capitalizeEachFirstLetter(item.nama_tempat)}
                  description={item.jenis}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DestinationListPages;
