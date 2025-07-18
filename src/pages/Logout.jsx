import { signOut } from "firebase/auth"
import auth from "../firebase/authentication"
import {redirect} from "react-router-dom"

export const logoutLoader = async () => {
    try {
        await signOut(auth)
        return redirect("/")
    } catch(e) {
        console.error("Error signing out...", e)
        return null
    }
}