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
      <div
        className="map-container"
        style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <h3 style={{ textAlign: "start", marginBottom: "10px" }}>Lokasi</h3>
          <p style={{ textAlign: "start", marginBottom: "10px" }}>Klik peta untuk melihat lokasi di Google Maps</p>
        </div>
        <div style={{ width: "100%", height: "400px", borderRadius: "10px", overflow: "hidden" }}>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultZoom={18}
              defaultCenter={position}
              mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`, "_blank");
              }}
            />
            <AdvancedMarker
              id="marker"
              position={position}>
              <Pin
                background={"#FF0000"}
                borderColor={"white"}
                glyphColor={"white"}
              />
            </AdvancedMarker>
          </APIProvider>
        </div>
      </div>
    );
  };

  const capitalizeEachFirstLetter = (val) => {
    return val.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (isLoading || !data) return <Loading />;

  return (
    <div>
      <Header />
      <InstallButton />
      <div className="container-detail-tempat-wisata">
        <Breadcrumb
          className="breadcrumb-dashboard"
          items={[
            { title: <a href="/destination">Tempat Wisata</a> },
            {
              title: <a href={`/destination/${data.jenis.toLowerCase()}`}>{data.jenis}</a>,
            },
            { title: capitalizeEachFirstLetter(data.nama_tempat) },
          ]}
        />

        <div className="detail-tempat-wisata">
          <h1>{capitalizeEachFirstLetter(data.nama_tempat)}</h1>
          <img
            src={import.meta.env.VITE_API_URL + data.gambar}
            alt={data.nama_tempat}
          />
          <p>Jenis: Wisata {data.jenis}</p>
          <p>Alamat: {data.alamat}</p>
          <div dangerouslySetInnerHTML={{ __html: data.deskripsi }} />

          {data.deskripsi_tiket && data.link_tiket && data.deskripsi_tiket !== "undefined" && data.link_tiket !== "undefined" && data.deskripsi_tiket.trim() !== "" && data.link_tiket.trim() !== "" && (
            <>
              <h3>Pembelian Tiket Online</h3>
              <div className="tiket-container">
                <p>{data.deskripsi_tiket}</p>
                <a
                  href={data.link_tiket}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiket-link">
                  Beli Tiket
                </a>
              </div>
            </>
          )}

          <h3>Berikut adalah media sosial tempat wisata yang bisa diikuti</h3>
          <>
            {Object.values(data.sosmed).every((link) => !link) ? (
              <p>Tempat wisata belum memiliki sosial media resmi.</p>
            ) : (
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {Object.entries(data.sosmed).map(([platform, link]) => {
                  if (!link) return null;

                  const icons = {
                    instagram: <InstagramOutlined style={{ fontSize: 20, color: "#C13584" }} />,
                    facebook: <FacebookFilled style={{ fontSize: 20, color: "#4267B2" }} />,
                    twitter: <XOutlined style={{ fontSize: 20, color: "black" }} />,
                    youtube: <YoutubeFilled style={{ fontSize: 20, color: "#FF0000" }} />,
                    tiktok: <TikTokOutlined style={{ fontSize: 20, color: "black" }} />,
                  };

                  return (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      className="sosmed-link"
                      rel="noopener noreferrer">
                      {icons[platform]}
                    </a>
                  );
                })}
              </div>
            )}
          </>
          <div className="map-container">{renderMap()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetailPages;
