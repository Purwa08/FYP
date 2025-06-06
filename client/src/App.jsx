import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import AddCourse from './pages/AddCourse';
import CourseDetails from './pages/CourseDetails';
import PrivateRoute from './components/PrivateRoute';
import TakeAttendance from './pages/TakeAttendance';
import AddStudentPage from './pages/AddSudent';
import UpdateCoursePage from './pages/UpdateCourse';

export default function App() {
    return (
      <BrowserRouter>
      <Header />
        <Routes>
          
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />

          <Route path='/about' element={<About />} />

          <Route element={<PrivateRoute/>} >

          <Route path='/' element={<Home />} />

          <Route path='/profile' element={<Profile />} />

          <Route path="/addcourse" element={<AddCourse />} />

          <Route path="/course/:id" element={<CourseDetails />} />
          
          <Route path="/take-attendance/:id" element={<TakeAttendance />} />

          <Route path="/add-student/:id" element={<AddStudentPage/>} />

          <Route path='/update-course/:id' element={<UpdateCoursePage/>}/>

          </Route>
          
        </Routes>
      </BrowserRouter>
  )
}
