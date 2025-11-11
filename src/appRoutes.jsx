import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutAdmin from './componentsAdmin/layoutAdmin'
import LayoutClient from './componentsClient/layoutClient'
import LogInClient from './componentsClient/logInClient'
import SignUpClient from './componentsClient/signUpClient'
import Page404 from './componentsClient/Page404'
import Welcome from './componentsClient/welcome';
import HomeClient from './componentsClient/homeClient';
import DashboardAdmin from './componentsAdmin/dashboardAdmin';
import DashboardAdmin222 from './componentsAdmin/dashboardAdmin222';
import Varification from './componentsClient/varification';
import LogoutClient from './componentsClient/logoutClient';
import medicalIntakeForm from './componentsClient/medicalIntakeForm';
import dashboard from './componentsClient/dashboard';
import gameList from './componentsClient/gameList';
import practiceList from './componentsClient/practiceList';
import instructions from './componentsClient/instructions';
import cameraCalibration from './componentsClient/cameraCalibration';
import practice from './componentsClient/practice';
import game from './componentsClient/game';
import performanceAnalisys from './componentsClient/performanceAnalisys';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path='/admin/admin222' element={<DashboardAdmin222 />} />
        </Route>

        <Route path="/" element={<LayoutClient />}>
          <Route index element={<Welcome />} />
          <Route path="/signup" element={<SignUpClient />} />
          <Route path="/varification" element={<Varification/>}/>
          <Route path="/login" element={<LogInClient />} />
          <Route path="/homeClient" element={<HomeClient />} /> 
          <Route path="/logout" element={<LogoutClient />} />
          <Route path="/*" element={<Page404 />} />
          <Route path="/medicalIntakeForm" element={<MedicalIntakeForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gameList" element={<GameList />} />
          <Route path="/practiceList" element={<PracticeList />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/cameraCalibration" element={<CameraCalibration />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/game" element={<Game />} />
          <Route path="/performanceAnalisys" element={<PerformanceAnalisys />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes