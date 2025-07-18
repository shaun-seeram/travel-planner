import RootLayout from './pages/RootLayout'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from "./pages/Home"
import Authentication, {action as authAction} from "./pages/Authentication"
import Trips from "./pages/Trips"
import AddTrip from "./pages/AddTrip"
import TripDetails from "./pages/TripDetails"
import {logoutLoader} from "./pages/Logout"
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import auth from './firebase/authentication'
import { useDispatch } from 'react-redux'
import { authActions } from './store'
import { asyncAuthCheck } from './util'

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("LOGIN")
        dispatch(authActions.login(user.uid))
      } else {
        console.log("LOGOUT")
        dispatch(authActions.logout())
      }
    })
  }, [dispatch])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: async () => await asyncAuthCheck,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "auth",
          element: <Authentication />,
          action: authAction
        },
        {
          path: "logout",
          loader: logoutLoader
        },
        {
          path: "trips",
          element: <Trips />
        },
        {
          path: "trips/add",
          element: <AddTrip />
        },
        {
          path: "trips/:id",
          element: <TripDetails />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App