import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { doApiGet } from "../services/apiService";

function DashboardAdmin222() {
  const initialUsers = [
    {
      id: 1111,
      date_created: "10/10/2025111",
      a: "a",
      b: "a",

    },
    {
      id: 22222,
      date_created: "10/11/2025111",
      a: "b",
      b: "b",
    },
  ];

  let [ar, setAr] = useState(initialUsers);
  const ThisID = useSelector((state) => state.myDetailsSlice.idMorInfoAdmin);
  const [thisUser, setThisUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    let url = "/users/single/" + ThisID;
    try {
      let data = await doApiGet(url);
      // console.log(data.data);
      setThisUser(data.data);
      // doApiAllDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const toAdminResult = (id) => {
    // navigate to the admin performance analysis page; include id via state if needed
    navigate('/performanceAnalysisAdmin', { state: { gameId: id } });
  };

  // const doApiAllDetails = async () => {

  //   let url = "/" + ThisID;
  //   try {
  //     let data = await doApiGet(url);
  //     console.log(data.data);
  //     setAr(data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  return (
    <div className="container">
      <div style={{ textAlign: "center", justifyContent: "center" }}>
        <h1>user details</h1>
        <h4>Name :{thisUser.fullName}</h4>
      </div>

      <div>
        <table className="table table-striped shadow-lg">
          <thead>
            <tr>
              <th>*</th>
              <th>date</th>
              <th>?</th>
              <th>Admin Result</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((game, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{game.date_created ? game.date_created.substring(10, length - 1) : ""}</td>
                  <td>{game.a}</td>
                  <td>
                  <button className="btn btn-sm" onClick={() => toAdminResult(game._id || game.id || game._idMorInfoAdmin || game.id)}>
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardAdmin222;
