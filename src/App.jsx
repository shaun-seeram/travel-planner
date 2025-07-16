import RootLayout from './pages/RootLayout'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from "./pages/Home"
import Authentication from "./pages/Authentication"
import Trips from "./pages/Trips"
import AddTrip from "./pages/AddTrip"
import TripDetails from "./pages/TripDetails"

function App() {

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
          element: <Authentication />
        },
        {
          path: "logout"
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