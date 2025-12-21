import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doApiGet } from '../services/apiService';
import { reverse } from 'lodash';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addIdMorInfoAdmin } from '../featuers/myDetailsSlice';

const DashboardAdmin = () => {
  const nav = useNavigate();
  const initialUsers = [
    { _id: '1', fullName: 'Test User 1', email: 'test1@gmail.com', role: 'Admin' },
    { _id: '2', fullName: 'Test User 2', email: 'test2@gmail.com', role: 'user' },
  ];

  const [ar, setAr] = useState(initialUsers);
  const [ar2, setAr2] = useState(initialUsers);
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
      setAr(data);
      setAr2(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchClick = () => {
    const tempAr = ar2.filter(user => 
      user.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if (tempAr.length > 0) {
      setAr(tempAr);
    } else {
      if (searchText === '') {
        setAr(ar2);
      } else {
        setAr([]); // לא נמצאו תוצאות
      }
    }
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const toAdmin2 = (id) => {
    dispatch(addIdMorInfoAdmin({ idMorInfoAdmin: id }));
    nav('/admin/admin222');
  };

  // Styles based on Fitwave.ai
  const uiStyle = {
    wrapper: { fontFamily: "'Inter', sans-serif", padding: '40px 0' },
    title: { fontWeight: '800', fontSize: '2rem', marginBottom: '30px' },
    brandItalic: { fontFamily: 'cursive', fontStyle: 'italic', color: '#F2743E' },
    searchContainer: {
      backgroundColor: '#FFFFFF',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      marginBottom: '30px',
      border: '1px solid #F0F0F0'
    },
    input: {
      backgroundColor: '#F7F7F7',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '0.95rem'
    },
    searchBtn: {
      backgroundColor: '#F2743E',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '0 25px',
      fontWeight: '600',
      marginLeft: '10px'
    },
    tableCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: '1px solid #F0F0F0'
    },
    th: {
      backgroundColor: '#F7F7F7',
      padding: '18px 20px',
      fontSize: '0.85rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      color: '#666',
      borderBottom: '1px solid #EEE'
    },
    td: {
      padding: '18px 20px',
      fontSize: '0.95rem',
      verticalAlign: 'middle',
      borderBottom: '1px solid #F7F7F7'
    },
    roleBadge: (role) => ({
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      backgroundColor: role.toLowerCase() === 'admin' ? '#FFF3EF' : '#F0F0F0',
      color: role.toLowerCase() === 'admin' ? '#F2743E' : '#666'
    }),
    infoBtn: {
      color: '#F2743E',
      fontSize: '1.4rem',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      transition: '0.2s'
    }
  };

  return (
    <div style={uiStyle.wrapper} className="container">
      <h1 style={uiStyle.title}>
        User <span style={uiStyle.brandItalic}>Management</span>
      </h1>

      {/* Search Bar Container */}
      <div style={uiStyle.searchContainer}>
        <div className="d-flex">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            style={uiStyle.input}
            className="form-control shadow-none"
            placeholder="Search users by full name..."
          />
          <button
            type="button"
            onClick={onSearchClick}
            style={uiStyle.searchBtn}
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={uiStyle.tableCard}>
        <table className="table mb-0">
          <thead>
            <tr>
              <th style={uiStyle.th}>#</th>
              <th style={uiStyle.th}>Full Name</th>
              <th style={uiStyle.th}>E-mail Address</th>
              <th style={uiStyle.th}>Role</th>
              <th style={uiStyle.th} className="text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((user, index) => (
              <tr key={user._id} className="admin-row">
                <td style={uiStyle.td}>{index + 1}</td>
                <td style={{ ...uiStyle.td, fontWeight: '600' }}>{user.fullName}</td>
                <td style={uiStyle.td}>{user.email}</td>
                <td style={uiStyle.td}>
                  <span style={uiStyle.roleBadge(user.role)}>{user.role}</span>
                </td>
                <td style={uiStyle.td} className="text-center">
                  <button
                    style={uiStyle.infoBtn}
                    onClick={() => toAdmin2(user._id)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .admin-row:hover { background-color: #FAFAFA; }
          .admin-row:last-child td { border-bottom: none; }
        `}
      </style>
    </div>
  );
};

export default DashboardAdmin;