import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './features/Home/Home'
import Login from './components/Login'
import Register from './components/Register'
import Missing from './features/Redirections/Missing';
import Unauthorized from './features/Redirections/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Exercise from './components/Exercise';



export default function AllRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        
          {/* <Route element={<PersistentLogin />}> */}
            <Route element={<RequireAuth />}>
              {/* <Route element={<MainLayout />}>  */}
                <Route path="/" element={<Home />} />
                <Route path="/:name" element={<Exercise />} />
                {/* <Route path="/compounds" element={<Compounds />} />
                <Route path="/sharedcompounds" element={<SharedCompounds />} />
                <Route path="/compounds/:id" element={<Compound />} />
                <Route path="/compounds/:c_id/:m_id" element={<Measurement />} /> */}
                
              {/* </Route> */}
            </Route>
          
        {/* </Route> */}
        
       

        <Route path="*" element={<Missing />} />
    </Routes>
 
  )
}