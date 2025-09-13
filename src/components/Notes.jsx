import { useDispatch, useSelector } from "react-redux";
import GrayContainer from "../ui/GrayContainer";
import classes from "./Notes.module.css"
import { useRef, useState } from "react";
import Button, { save } from "../ui/Button";
import { authActions } from "../store";
import { fbSet } from "../firebase/authentication";
import DetailsContainer from "../ui/DetailsContainer";

export default function Notes({id}) {

    const dispatch = useDispatch()
    const [isChanged, setIsChanged] = useState(false)
    const {text: notes = "", height = ""} = useSelector(state => state.auth.trips[id].notes)
    const [text, setText] = useState(notes)
    const textRef = useRef()

    const handleChange = (e) => {
        setIsChanged(true)
        setText(e.target.value)
    }

    const handleSave = () => {
        fbSet(`/trips/${id}/notes`, {
            height: textRef.current.style.height,
            text
        })
        dispatch(authActions.saveNotes({
            tripId: id,
            notes: {
                text: notes,
                height: textRef.current.style.height
            }
        }))
        setIsChanged(false)
    }

  return (
    <DetailsContainer title={"Notes"}>
        <GrayContainer>
            <textarea ref={textRef} value={text} style={height ? {"height": height} : null} onChange={handleChange} rows="5" className={classes.textarea} />
            {isChanged && <Button onClick={handleSave} className={classes.button} icon={save}>Save</Button>}
        </GrayContainer>
    </DetailsContainer>
  )
}
