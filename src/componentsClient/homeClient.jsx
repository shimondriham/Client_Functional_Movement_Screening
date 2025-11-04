import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  doApiGet, doApiMethod } from '../services/apiService';
import { addIfShowNav, addIsAdmin, addName } from '../featuers/myDetailsSlice';

const HomeClient = () => {
    const myName = useSelector(state => state.myDetailsSlice.name);
    const IsAdmin = useSelector(state => state.myDetailsSlice.isAdmin);
    const navigate = useNavigate();
    const [myInfo, setmyInfo] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: true }));
        console.log(myName);
        doApi()
    }, []);

    const doApi = async () => {
        let url = "/users/myInfo";
        try {
            let data = await doApiGet(url);
            setmyInfo(data.data);
            dispatch(addName({ name: data.data.fullName }));
            if (data.data.role == "admin") {
                dispatch(addIsAdmin({ isAdmin: true }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container text-center" style={{ height: '100vh', padding: '20px', }}>
            <h1 className='mb-2'>Welcome {myName}{myInfo.FirstName}</h1>
        </div>
    );
};

export default HomeClient;
