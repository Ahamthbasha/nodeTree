import {Routes,Route} from 'react-router-dom'
import LoginPage from '../pages/user/Auth/Login'
import UserSessionRoute from '../protecter/UserSessionRoute'
import PrivateRoute from '../protecter/UserPrivateRoute'
import Dashboard from '../pages/user/MainPage/Dashboard'

const UserRouter = () => {
  return (
    <Routes>
      {/* <Route path='/' element={<TripUploadPage/>}/> */}
      <Route path='/user/login' element={<UserSessionRoute><LoginPage/></UserSessionRoute>}/>

      <Route path='/dashboard' element={
        <PrivateRoute>
        <Dashboard/>
      </PrivateRoute>}/>
    </Routes>
  )
}

export default UserRouter
