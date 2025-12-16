import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutAdmin from './componentsAdmin/layoutAdmin'
import LayoutClient from './componentsClient/layoutClient'
import LogInClient from './componentsClient/logInClient'
import SignUpClient from './componentsClient/signUpClient'
import Page404 from './componentsClient/Page404'
import Welcome from './componentsClient/welcome';
import DashboardAdmin from './componentsAdmin/dashboardAdmin';
import DashboardAdmin222 from './componentsAdmin/dashboardAdmin222';
import Varification from './componentsClient/varification';
import LogoutClient from './componentsClient/logoutClient';
import MedicalIntakeForm from './componentsClient/medicalIntakeForm';
import Dashboard from './componentsClient/dashboard';
import Instructions from './componentsClient/instructions';
import CameraCalibration from './componentsClient/cameraCalibration';
import PerformanceAnalysis from './componentsClient/performanceAnalysis';
import PerformanceAnalysisAdmin from './componentsClient/performanceAnalysisAdmin';
import Game1 from './componentsClient/game1';
import Game2 from './componentsClient/game2';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path='/admin/admin222' element={<DashboardAdmin222 />} />
          <Route path="/admin/performanceAnalysisAdmin" element={<PerformanceAnalysisAdmin />} />
        </Route>

        <Route path="/" element={<LayoutClient />}>
          <Route index element={<Welcome />} />
          <Route path="/signup" element={<SignUpClient />} />
          <Route path="/varification" element={<Varification/>}/>
          <Route path="/login" element={<LogInClient />} />
          <Route path="/logout" element={<LogoutClient />} />
          <Route path="/*" element={<Page404 />} />
          <Route path="/medicalIntakeForm" element={<MedicalIntakeForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/cameraCalibration" element={<CameraCalibration />} />
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
          <Route path="/performanceAnalysis" element={<PerformanceAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes