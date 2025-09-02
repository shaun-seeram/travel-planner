import RootLayout from './pages/RootLayout'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from "./pages/Home"
import Authentication, {action as authAction} from "./pages/Authentication"
import Trips from "./pages/Trips"
import AddTrip, { addTripAction } from "./pages/AddTrip"
import TripDetails, { tripDetailsAction, tripDetailsLoader } from "./pages/TripDetails"
import {logoutLoader} from "./pages/Logout"
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import auth from './firebase/authentication'
import { useDispatch } from 'react-redux'
import { asyncLogin, authActions } from './store'
import Settings from './pages/Settings'

function App() {

  console.log("App")

  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("LOGIN")
        dispatch(asyncLogin(user.uid))
      } else {
        console.log("LOGOUT")
        dispatch(authActions.logout())
      }
    })

    return () => unsubscribe
  }, [dispatch])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      // loader: async () => {
      //   await new Promise((resolve) => {
      //     onAuthStateChanged(auth, (user) => {
      //       if (user) {
      //         resolve()
      //       } else {
      //         resolve()
      //       }
      //     });
      //   })
      //   return null
      // },
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
          element: <TripDetails />,
          loader: tripDetailsLoader,
          shouldRevalidate: () => false,
          action: tripDetailsAction
        },
        {
          path: "settings",
          element: <Settings />,
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