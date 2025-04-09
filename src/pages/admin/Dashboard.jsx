import { Breadcrumb } from "antd";
import { useGetActiveUserDataQuery } from "../../slices/userApiSlice";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";

const Dasboard = () => {
  const { data: userInfo } = useGetActiveUserDataQuery();

  const generateTimestamp = (n) => {
    // generate a random timestamp sebanyak n kali urut seminggu lalu
    const timestamps = [];
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // satu minggu lalu

    for (let i = 0; i < n; i++) {
      // format 08/04/2025 6:02:20
      const randomDate = new Date(oneWeekAgo.getTime() + Math.random() * (currentDate.getTime() - oneWeekAgo.getTime()));
      const day = String(randomDate.getDate()).padStart(2, "0");
      const month = String(randomDate.getMonth() + 1).padStart(2, "0"); // bulan dimulai dari 0

      const year = randomDate.getFullYear();
      const hours = String(randomDate.getHours()).padStart(2, "0");
      const minutes = String(randomDate.getMinutes()).padStart(2, "0");
      const seconds = String(randomDate.getSeconds()).padStart(2, "0");

      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      timestamps.push(formattedDate);
    }
    return timestamps;
  };

  const output = generateTimestamp(16)
    .sort((a, b) => {
      const dateA = new Date(a.split(" ")[0].split("/").reverse().join("-") + " " + a.split(" ")[1]);
      const dateB = new Date(b.split(" ")[0].split("/").reverse().join("-") + " " + b.split(" ")[1]);
      return dateA - dateB;
    })
    .map((item) => `${item}`)
    .join("\n");

  console.log(output);

  return (
    <>
      <Header />
      <div
        className="wrapper-body"
        style={{
          display: "flex",
        }}>
        <Sidebar activeMenu={"dashboard"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[
                {
                  title: <a href="/admin/dashboard">Home</a>,
                },
                {
                  title: "Dashboard",
                },
              ]}
            />
          </div>
          <div className="container-dashboard-main">
            <h2>Selamat Datang {userInfo.username}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dasboard;
