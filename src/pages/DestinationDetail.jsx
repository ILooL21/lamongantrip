import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useGetDestinationByNameMutation } from "../slices/destinationApiSlice";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { FacebookFilled, InstagramOutlined, TikTokOutlined, XOutlined, YoutubeFilled } from "@ant-design/icons";
import "../styles/DestinationDetail.css";
import { Breadcrumb, Table } from "antd";
import InstallButton from "../components/InstallButton";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import Footer from "../components/Footer";

const DestinationDetailPages = () => {
  const { nama } = useParams();
  const [data, setData] = useState(null);
  const [position, setPosition] = useState({
    lat: "",
    lng: "",
  });

  const [getDestinationData, { isLoading }] = useGetDestinationByNameMutation();

  useEffect(() => {
    if (nama) {
      const fetchData = async () => {
        try {
          const response = await getDestinationData({ nama }).unwrap();

          document.title = `${response.nama_tempat} | Lamongan Trip`;

          // Parse sosmed & tiket
          const sosmed = JSON.parse(response.sosmed);

          // Set position for map
          setPosition({
            lat: parseFloat(response.latitude),
            lng: parseFloat(response.longitude),
          });

          setData({
            ...response,
            sosmed,
          });
        } catch (err) {
          console.error("Error fetching destination data:", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Data Tempat Wisata tidak ditemukan",
          }).then(() => {
            window.location.href = "/not-found";
          });
        }
      };
      fetchData();
    }
  }, [nama, getDestinationData]);
  const renderMap = () => {
    if (!position.lat || !position.lng) return null;

    return (
      <>
        <h3>Lokasi</h3>
        <p className="map-instruction">Klik peta untuk melihat lokasi di Google Maps</p>
        <div className="map-wrapper">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultZoom={18}
              defaultCenter={position}
              mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`, "_blank");
              }}>
              <AdvancedMarker
                id="marker"
                position={position}>
                <Pin
                  background={"#007f73"}
                  borderColor={"white"}
                  glyphColor={"white"}
                />
              </AdvancedMarker>
            </Map>
          </APIProvider>
        </div>
      </>
    );
  };

  const capitalizeEachFirstLetter = (val) => {
    return val.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="destination-detail-container">
      <Header />
      <InstallButton />
      {/* Hero Section with Destination Image Background */}
      <div
        className="destination-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,127,115,0.3), rgba(0,0,0,0.7)), url(${import.meta.env.VITE_API_URL + data.gambar})`,
        }}></div>{" "}
      <div className="detail-destination-card-container">
        {/* Main Content Card */}
        <div className="detail-destination-card">
          {/* Breadcrumb inside card */}
          <Breadcrumb
            className="breadcrumb-destination"
            items={[
              { title: <a href="/destination">Tempat Wisata</a> },
              {
                title: <a href={`/destination/${data.jenis.toLowerCase()}`}>{data.jenis}</a>,
              },
              { title: capitalizeEachFirstLetter(data.nama_tempat) },
            ]}
          />
          {/* Title and address above image */}
          <div className="destination-title">
            <h1>{capitalizeEachFirstLetter(data.nama_tempat)}</h1>
            <p className="destination-address">
              <span className="address-icon">📍</span>
              {data.alamat}
            </p>
          </div>
          {/* Destination Image in Card */}
          <div className="destination-image-wrapper">
            <img
              src={import.meta.env.VITE_API_URL + data.gambar}
              alt={data.nama_tempat}
              className="destination-image"
            />
          </div>
          {/* Destination Info */}
          <div className="destination-info">
            <div className="info-item">
              <span className="info-label">Jenis Wisata:</span>
              <span className="info-value">Wisata {data.jenis}</span>
            </div>
          </div>
          {/* Destination Description */}
          <div
            className="destination-description"
            dangerouslySetInnerHTML={{ __html: data.deskripsi }}
          />{" "}
          {/* Online Ticket Section */}
          {data.deskripsi_tiket && data.link_tiket && data.deskripsi_tiket !== "undefined" && data.link_tiket !== "undefined" && data.deskripsi_tiket.trim() !== "" && data.link_tiket.trim() !== "" && (
            <div className="ticket-section">
              <h3>Pembelian Tiket Online</h3>
              <div className="ticket-container">
                <p>{data.deskripsi_tiket}</p>
                <a
                  href={data.link_tiket}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ticket-button">
                  Beli Tiket
                </a>
              </div>
            </div>
          )}{" "}
          {/* Social Media Section */}
          <div className="destination-social-section">
            <h3>Media Sosial</h3>
            {Object.values(data.sosmed).every((link) => !link) ? (
              <p className="no-social">Tempat wisata belum memiliki sosial media resmi.</p>
            ) : (
              <div className="social-links">
                {Object.entries(data.sosmed).map(([platform, link]) => {
                  if (!link) return null;

                  const icons = {
                    instagram: <InstagramOutlined className="social-icon instagram" />,
                    facebook: <FacebookFilled className="social-icon facebook" />,
                    twitter: <XOutlined className="social-icon twitter" />,
                    youtube: <YoutubeFilled className="social-icon youtube" />,
                    tiktok: <TikTokOutlined className="social-icon tiktok" />,
                  };

                  return (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      className="social-link icon-only"
                      rel="noopener noreferrer"
                      title={platform}>
                      {icons[platform]}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          {/* Map Section */}
          <div className="map-section">{renderMap()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetailPages;
