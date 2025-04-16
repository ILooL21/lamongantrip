import Header from "../components/Header";
import karakterImg from "../assets/mascot.png";
import "../styles/DestinationRecomendation.css";
import { useState, useEffect } from "react";
import { Radio, Checkbox, Col, Row } from "antd";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";
import { useGetRecommendationsMutation, useGetUserRecommendationsLogMutation } from "../slices/recommendationApiSlice";

const questions = [
  {
    title: "Escape",
    Q: "Apakah Anda mencari tempat wisata untuk menghilangkan stres dan kejenuhan dari pekerjaan sehari-hari?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Relaxation",
    Q: "Apakah Anda mencari tempat wisata yang memberikan kesegaran dan relaksasi?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Play",
    Q: "Apakah Anda mencari tempat wisata yang bisa digunakan untuk bermain dan bergembira?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Strengthening family bonds",
    Q: "Apakah Anda mencari tempat wisata yang dapat mempererat hubungan keluarga?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Prestige",
    Q: "Apakah Anda mencari tempat wisata yang dapat menunjukkan gengsi dan gaya hidup?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Social Interaction",
    Q: "Apakah Anda mencari tempat wisata untuk berinteraksi dengan orang lain?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Romance",
    Q: "Apakah Anda mencari tempat wisata yang memberikan suasana romantis?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Educational Opportunity",
    Q: "Apakah Anda mencari tempat wisata yang memberikan edukasi atau pengalaman belajar baru?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Self-fulfillment",
    Q: "Apakah Anda mencari tempat wisata yang memberikan jati diri atau pengalaman yang memuaskan secara pribadi?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Wish-fulfillment",
    Q: "Apakah Anda mencari tempat wisata yang bisa merealisasikan mimpi-mimpi Anda, seperti petualangan atau hal-hal ekstrem?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Infrastruktur Pariwisata",
    Q: "Apakah Anda mencari tempat wisata dengan fasilitas yang memadai?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Edukasi",
    Q: "Apakah Anda mencari tempat wisata yang memberikan wawasan atau pengetahuan baru?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Alam Sekitar",
    Q: "Apakah Anda mencari tempat wisata dengan lingkungan dan alam yang menarik?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Atraksi Budaya dan Sejarah",
    Q: "Apakah Anda mencari tempat wisata yang memiliki atraksi budaya atau warisan sejarah?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Kuliner",
    Q: "Apakah Anda mencari tempat wisata yang memiliki kuliner yang menarik?",
    A: ["Ya", "Tidak"],
    type_question: "one",
  },
  {
    title: "Aktivitas Wisata",
    Q: "Aktivitas apa saja yang ingin Anda lakukan di tempat wisata?",
    A: ["Makan", "Belajar", "Berinteraksi dengan satwa", "Mengambil Foto", "Berziarah", "Berkemah", "Melihat Pemandangan", "Berbelanja", "Berenang", "Berendam", "Memancing", "Bermain Wahana"],
    type_question: "multiple",
  },
];

const DestinationRecomendationPages = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [listRecomendation, setListRecommendation] = useState([]);
  const [answer, setAnswer] = useState({
    escape: null,
    relaxation: null,
    play: null,
    strengthening_family_bonds: null,
    prestige: null,
    social_interaction: null,
    romance: null,
    educational_opportunity: null,
    self_fulfillment: null,
    wish_fulfillment: null,
    infrastruktur_pariwisata: null,
    edukasi: null,
    alam_sekitar: null,
    atraksi_budaya_dan_sejarah: null,
    kuliner: null,
    makan: null,
    belajar: null,
    berinteraksi_dengan_satwa: null,
    mengambil_foto: null,
    berziarah: null,
    berkemah: null,
    melihat_pemandangan: null,
    berbelanja: null,
    berenang: null,
    berendam: null,
    memancing: null,
    bermain_wahana: null,
  });

  const isLogin = localStorage.getItem("Access-token");

  const [getRecommendations] = useGetRecommendationsMutation();
  const [getRecommendationsLog, { isLoading }] = useGetUserRecommendationsLogMutation();

  useEffect(() => {
    const fetchRecommendationsLog = async () => {
      try {
        const res = await getRecommendationsLog().unwrap();
        if (res) {
          setListRecommendation(res);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    if (isLogin) {
      fetchRecommendationsLog();
    }
  }, [isLogin, getRecommendationsLog]);

  const handleKirimJawaban = async () => {
    if (Object.values(answer).every((value) => value !== null)) {
      await getRecommendations(answer)
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Rekomendasi Ditemukan!",
            text: "Kami telah menemukan rekomendasi tempat wisata untuk Anda.",
            showCancelButton: false,
            confirmButtonText: "Lihat Rekomendasi",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            // reload page
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat mendapatkan rekomendasi.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silahkan jawab semua pertanyaan",
      });
    }
  };
  const handleAnswer = (value) => {
    const question = questions[currentQuestionIndex];
    if (question.type_question === "multiple") {
      const updatedAnswers = { ...answer };
      question.A.forEach((activity) => {
        const key = activity.toLowerCase().replace(/[\s-]/g, "_");
        updatedAnswers[key] = value.includes(activity) ? 1 : 0;
      });
      setAnswer(updatedAnswers);
    } else {
      const key = question.title.toLowerCase().replace(/[\s-]/g, "_");
      setAnswer((prev) => ({ ...prev, [key]: value === "Ya" ? 1 : 0 }));
    }

    // Lanjut ke pertanyaan berikutnya jika ada
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const formattingNameLinkDestinations = (val) => {
    return val.replace(/\s+/g, "-").toLowerCase();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Header />
      <InstallButton />
      <div className="destination-recommendation-page">
        <div className="akinator-layout">
          <img
            src={karakterImg}
            alt="Karakter"
            className="character-image"
          />

          <div className="question-container">
            {/* 👋 Halaman sambutan */}
            {!isStarted ? (
              isLogin ? (
                <>
                  {isLoading && listRecomendation.length === 0 ? (
                    <div className="speech-bubble">
                      <h1>Loading...</h1>
                      <p>Mohon tunggu sebentar.</p>
                    </div>
                  ) : listRecomendation.length > 0 ? (
                    <>
                      <div className="speech-bubble">
                        <h2>Selamat datang kembali!</h2>
                        <p>Kamu sudah mendapatkan rekomendasi sebelumnya.</p>

                        <ul className="mt-4 space-y-3">
                          {listRecomendation.map((item) => (
                            <li
                              key={item.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => (window.location.href = `/destination/detail/${formattingNameLinkDestinations(item.nama_tempat_wisata)}`)}>
                              <p>
                                <strong>{item.nama_tempat_wisata}</strong>
                              </p>
                            </li>
                          ))}
                        </ul>

                        <p className="mt-6">Klik Tempat Wisata untuk melihat detailnya.</p>
                        <p>Silahkan klik tombol di bawah untuk mendapat rekomendasi yang lain.</p>
                      </div>
                    </>
                  ) : (
                    <div className="speech-bubble">
                      <h1>Selamat datang!</h1>
                      <p>Saya di sini untuk memberi kamu rekomendasi tempat wisata di Lamongan.</p>
                      <p>Bisakah kamu menjawab beberapa pertanyaan saya?</p>
                    </div>
                  )}
                  <div className="navigation-buttons">
                    <button
                      className="start-button"
                      onClick={() => {
                        setIsStarted(true);
                      }}>
                      {listRecomendation.length > 0 ? "Cari Rekomendasi Lagi" : "Cari Rekomendasi"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="speech-bubble">
                    <h1>Kamu Belum Login!</h1>
                    <p>Untuk Mendapat Rekomendasi Sesuai Minat dan Preferensi Anda.</p>
                    <p>Silahkan login terlebih dahulu</p>
                  </div>

                  <div className="navigation-buttons">
                    <button
                      className="start-button"
                      onClick={() => {
                        window.location.href = "/auth";
                      }}>
                      Login
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="speech-bubble">
                  <p>{currentQuestion.Q}</p>
                </div>

                <div className="answer-buttons">
                  {currentQuestion.type_question === "one" && (
                    <Radio.Group
                      onChange={(e) => handleAnswer(e.target.value)}
                      value={answer[currentQuestion.title.toLowerCase().replace(/[\s-]/g, "_")] === null ? undefined : answer[currentQuestion.title.toLowerCase().replace(/[\s-]/g, "_")] === 1 ? "Ya" : "Tidak"}>
                      {currentQuestion.A.map((option) => (
                        <Radio
                          key={option}
                          value={option}>
                          {option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}

                  {currentQuestion.type_question === "multiple" && (
                    <Checkbox.Group
                      onChange={(checkedValues) => {
                        const updatedAnswers = { ...answer };
                        currentQuestion.A.forEach((activity) => {
                          const key = activity.toLowerCase().replace(/[\s-]/g, "_");
                          updatedAnswers[key] = checkedValues.includes(activity) ? 1 : 0;
                        });
                        setAnswer(updatedAnswers);
                      }}
                      value={currentQuestion.A.filter((activity) => answer[activity.toLowerCase().replace(/[\s-]/g, "_")])}>
                      <Row gutter={[16, 8]}>
                        {currentQuestion.A.map((option) => (
                          <Col
                            span={12}
                            key={option}>
                            <Checkbox value={option}>{option}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  )}
                </div>

                <div className="navigation-buttons">
                  <button
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}>
                    Sebelumnya
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>Selanjutnya</button>
                  ) : (
                    <button
                      onClick={() =>
                        Object.values(answer).every((value) => value !== null)
                          ? handleKirimJawaban()
                          : Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: "Silahkan jawab semua pertanyaan",
                            }).then(() => {
                              setCurrentQuestionIndex(0);
                            })
                      }>
                      Kirim Jawaban
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationRecomendationPages;
