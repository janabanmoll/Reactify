import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import UsersList from "./pages/UsersList"
import Posts from "./pages/Posts"
import PostsPerUser from "./pages/PostsPerUser"
import Navbar from "./components/Navbar"
import UserCharts from "./pages/UserCharts"
import Settings from "./pages/Settings"
import PostsChart from "./pages/PostsChart"
import Login from "./pages/Login"
import ProtectedRoute from "./pages/ProtectedRoute"
import SignUp from "./pages/SignUp"
import NotFound from "./pages/NotFound"
import { NotificationProvider } from "./context/NotificationContext"


export default function App() {


  return (
    <NotificationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>

          } />
          <Route path="/charts" element={

            <ProtectedRoute>
              <UserCharts />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={

          
              <Settings />
          } />
          <Route path="/posts" element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          } />
          <Route path="/postsperuser" element={
            <ProtectedRoute>
              <PostsPerUser />
            </ProtectedRoute>
          } />
          <Route path="/postschart" element={

            <ProtectedRoute>
              <PostsChart />
            </ProtectedRoute>
          } />

        </Route>

      </Routes>

    </BrowserRouter>
    </NotificationProvider>
  )
}