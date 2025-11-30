import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doApiGet } from '../services/apiService';
import { reverse } from 'lodash';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addIdMorInfoAdmin } from '../featuers/myDetailsSlice';

const initialUsers = [
  {
    id: 1,
    fullName: 'test1',
    email: 'test1@gmail.com',
    role: 'Admin',
  },
  {
    id: 2,
    fullName: 'test2',
    email: 'test2@gmail.com',
    role: 'user',
  },
];

const DashboardAdmin = () => {
  const nav = useNavigate();
  const [ar, setAr] = useState(initialUsers);
  const [ar2, setAr2] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    const url = '/users';
    try {
      const resData = await doApiGet(url);
      const data = resData.data;
      reverse(data);
      console.log(data);
      setAr(data);
      setAr2(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchClick = () => {
    const tempAr = [];
    for (let index = 0; index < ar2.length; index++) {
      if (ar2[index].fullName === searchText) {
        tempAr.push(ar2[index]);
      }
    }
    if (tempAr.length > 0) {
      setAr(tempAr);
      console.log('User found');
    } else {
      console.log('User with this name not found');
      if (searchText === '') {
        setAr(ar2);
      }
    }
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const toAdmin2 = (id) => {
    console.log(id);
    dispatch(addIdMorInfoAdmin({ idMorInfoAdmin: id }));
    nav('/admin/admin222');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            className="form-control rounded"
            placeholder="Search by name"
          />
          <button
            type="button"
            onClick={onSearchClick}
            className="btn btn-outline-info border-dark"
          >
            Search
          </button>
        </div>
      </div>

      <table className="table table-striped shadow-lg">
        <thead>
          <tr>
            <th>List</th>
            <th>Name</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          {ar.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-sm"
                  onClick={() => toAdmin2(user._id)}
                >
                  <i className="bi bi-arrow-right-circle-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAdmin;
