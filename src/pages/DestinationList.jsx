import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
  // Import tugu image
  const tuguImg = new URL("../assets/tugu.jpg", import.meta.url).href;
  const alamImg = new URL("../assets/alam.jpeg", import.meta.url).href;
  const religiImg = new URL("../assets/religi.webp", import.meta.url).href;
  const buatanImg = new URL("../assets/buatan.webp", import.meta.url).href;

  // Select hero background based on destination type
  const getHeroBackground = () => {
    if (!jenis) return tuguImg;

    switch (jenis.toLowerCase()) {
      case "alam":
        return alamImg;
      case "religi":
        return religiImg;
      case "buatan":
        return buatanImg;
      default:
        return tuguImg;
    }
  };

  return (
    <div className="destination-list-container">
      <Header />
      <InstallButton />
      {/* Hero Section with Background Image */}
      <div
        className="destination-list-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,127,115,0.7), rgba(0,0,0,0.7)), url(${getHeroBackground()})`,
        }}>
        <div className="hero-content">
          <h1 className="hero-title">{jenis ? `Wisata ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}` : "Semua Tempat Wisata"}</h1>
          <p className="hero-subtitle">Jelajahi keindahan destinasi wisata di Indonesia</p>
        </div>
      </div>{" "}
      <div className="destination-list-wrapper">
        {filteredDestinations.length === 0 ? (
          <div className="no-data">
            <img
              src={img}
              alt="No results"
              className="no-data-img"
            />
            <h2>Tidak ada data tujuan wisata</h2>
          </div>
        ) : (
          <div className="destination-grid">
            {filteredDestinations.map((item) => (
              <div
                className="destination-card"
                key={item.id_tempat_wisata}
                onClick={() => (window.location.href = `/destination/detail/${formattingNameLinkDestinations(item.nama_tempat)}`)}>
                <div className="card-image-container">
                  <img
                    alt={item.nama_tempat}
                    src={`${import.meta.env.VITE_API_URL}${item.gambar}`}
                    className="card-image"
                  />
                </div>{" "}
                <div className="card-content">
                  <h2 className="destination-name">{capitalizeEachFirstLetter(item.nama_tempat)}</h2>
                  {!jenis && <p className="destination-type">{capitalizeEachFirstLetter(item.jenis)}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DestinationListPages;
