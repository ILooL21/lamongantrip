import Header from "../components/Header";
import karakterImg from "../assets/mascot.png";
import "../styles/DestinationRecomendation.css";
import { useState } from "react";
import { Radio, Checkbox, Col, Row } from "antd";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";

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
              <>
                <div className="speech-bubble">
                  <h1>Selamat datang!</h1>
                  <p>Saya di sini untuk memberi kamu rekomendasi tempat wisata di Lamongan.</p>
                  <p>Bisakah kamu menjawab beberapa pertanyaan saya?</p>
                </div>

                <div className="navigation-buttons">
                  <button
                    className="start-button"
                    onClick={() => {
                      if (isLogin) {
                        setIsStarted(true);
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Belum Login",
                          text: "Silahkan login terlebih dahulu",
                        }).then((res) => {
                          if (res.isConfirmed) {
                            window.location.href = "/auth";
                          }
                        });
                      }
                    }}>
                    Cari Rekomendasi
                  </button>
                </div>
              </>
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
                          ? console.log(answer)
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
