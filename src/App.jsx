import RootLayout from './pages/RootLayout'
import {createBrowserRouter, RouterProvider, redirect} from "react-router-dom"
import Home from "./pages/Home"
import Authentication, {authenticationAction} from "./pages/Authentication"
import Trips from "./pages/Trips"
import AddTrip, { addTripAction } from "./pages/AddTrip"
import TripDetails, { tripDetailsAction, tripDetailsLoader } from "./pages/TripDetails"
import {logoutLoader} from "./pages/Logout"
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import auth from './firebase/authentication'
import { useDispatch } from 'react-redux'
import { asyncLogin, authActions, store } from './store'
import Settings from './pages/Settings'

const protectedLoader = async () => {
  if (store.getState().auth.uid) { return null }

  await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe()
          if (user) {
            resolve()
          } else {
            reject(redirect("/auth"))
          }
      });
  })

  return null
}

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
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "auth",
          element: <Authentication />,
          action: authenticationAction
        },
        {
          path: "logout",
          loader: logoutLoader
        },
        {
          path: "trips",
          element: <Trips />,
          loader: protectedLoader,
        },
        {
          path: "trips/add",
          element: <AddTrip />,
          loader: protectedLoader,
          action: addTripAction
        },
        {
          path: "trips/:id",
          element: <TripDetails />,
          loader: tripDetailsLoader,
          action: tripDetailsAction
        },
        {
          path: "settings",
          element: <Settings />,
          loader: protectedLoader,
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