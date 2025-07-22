import RootLayout from './pages/RootLayout'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from "./pages/Home"
import Authentication, {action as authAction} from "./pages/Authentication"
import Trips from "./pages/Trips"
import AddTrip, { addTripAction } from "./pages/AddTrip"
import TripDetails from "./pages/TripDetails"
import {logoutLoader} from "./pages/Logout"
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import auth from './firebase/authentication'
import { useDispatch } from 'react-redux'
import { authActions } from './store'
import { rootLoader } from './pages/RootLayout'

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
      loader: rootLoader,
      shouldRevalidate: () => false,
      HydrateFallback: () => <></>,
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
          element: <AddTrip />,
          action: addTripAction
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