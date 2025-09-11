import { redirect } from "react-router-dom"
import auth, { fbUpdate, geocodingKey, latlonkey } from '../firebase/authentication';
import { useSelector } from 'react-redux';
import { authActions, store } from '../store';
import classes from "./TripDetails.module.css"
import Map from '../components/Map';
import TitleContainer from '../components/TitleContainer';
import GrayContainer from "../ui/GrayContainer"
import BudgetDetails from '../components/BudgetDetails';
import FlightDetails from '../components/FlightDetails';
import AccomodationDetails from "../components/AccomodationDetails"
import PlannerDetails from '../components/PlannerDetails';
import { onAuthStateChanged } from 'firebase/auth';

const TripDetails = () => {

    console.log("Page: TripDetails")

    const id = useSelector(state => state.auth.currentPage)

    // const [conversion, setConversion] = useState(0);

    // useEffect(() => {
    //     const getConversion = async () => {
    //         const currency = trip.currency
    //         const res = await fetch(`https://api.fxratesapi.com/convert?from=CAD&to=${currency}&date=2012-06-24&amount=1&format=json`)
    //         const resJson = await res.json();
    //         setConversion(resJson.result.toFixed(2) || 0)
    //     }
    //     getConversion()
    // }, [trip])

    return (
        <>
            <Map id={id} />
            <TitleContainer id={id} />

            <div className={classes.split}>
                <div className={classes.half}>

                    <BudgetDetails id={id} />
                    <FlightDetails id={id} />
                    <AccomodationDetails id={id} />
                    {/* <GrayContainer>
                        <p>1 CAD = {conversion} {trip.currency}</p>
                    </GrayContainer> */}

                </div>
                <div className={`${classes.half} ${classes.halfRight}`}>
                    <PlannerDetails id={id} />
                </div>
            </div>

        </>
    );
}

export default TripDetails;

export const tripDetailsLoader = async ({ params }) => {
    store.dispatch(authActions.changePage(params.id))
    if (store.getState().auth.sessionReady) { return null }

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

export const tripDetailsAction = async ({ request, params }) => {
    const data = await request.formData();
    const purposeId = new Date().getTime()
    const tripId = params.id
    const {purpose, ...formData} = Object.fromEntries(data.entries())

    if (purpose === "updateAccomodation") {
        formData.accomodationId = data.get("accomodationId") || purposeId

        const { accomodationId, ...formObject } = formData

        await fbUpdate("/trips/" + tripId + "/accomodations/" + accomodationId, formObject)

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateAccomodation({
            tripId,
            accomodationId,
            accomodation: formObject
        }))

        return null

    } else if (purpose === "updateFlight") {
        formData.flightId = data.get("flightId") || purposeId

        const { flightId, ...formObject } = formData

        const splitTime = formObject.boarding.split(":")
        let meridiem = " am"

        if (splitTime[0] === "00") { splitTime[0] = "12" }
        if (+splitTime[0] > 12) {
            splitTime[0] = +splitTime[0] - 12
            meridiem = " pm"
        }

        formObject.stringifiedBoarding = splitTime.join(":") + meridiem

        await fbUpdate("/trips/" + tripId + "/flights/" + flightId, formObject)

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateFlight({
            tripId,
            flightId,
            flight: formObject
        }))

        return null

    } else if (purpose === "editBudget") {
        const budget = data.get("budget")

        await fbUpdate("/trips/" + tripId + "/budget/", {
            budget: +budget
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.editBudget({
            tripId,
            budget: +budget
        }))

        return null

    } else if (purpose === "updateExpenses") {
        formData.expenseId = data.get("expenseId") || purposeId

        const { expenseId, ...formObject } = formData
        formObject.cost = +formObject.cost

        await fbUpdate("/trips/" + tripId + "/budget/expenses/" + expenseId, formObject)

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateExpense({
            tripId,
            expenseId,
            expense: formObject
        }))

        return null

    } else if (purpose === "updateTrip") {
        const { city, country, from, to } = formData
        const {from: oldFrom, to: oldTo} = store.getState().auth.trips[tripId]

        if (from !== oldFrom || to !== oldTo) {
            const newFrom = new Date(from.split("-"))
            const newTo = new Date(to.split("-"))
            const planner = {}
            const months = ["January", "February", "March", "April", "May", "June", 'July', "August", 'September', "October", "November", 'December']

            for (let i = newFrom.getTime(); i <= (newTo.getTime()); i += 86400000) {
                const iteration = new Date(i)
                planner[i] = {
                    stringifiedDate: `${months[iteration.getMonth()]} ${iteration.getDate()}, ${iteration.getFullYear()}`
                }
            }

            await fbUpdate("/trips/" + tripId, {
                planner
            })
        }

        const latlonRes = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
            headers: {
                "X-Api-Key": latlonkey
            }
        })

        const latLon = await latlonRes.json()

        const currencyRes = await fetch(`https://api.api-ninjas.com/v1/country?name=${country}`, {
            headers: {
                "X-Api-Key": latlonkey
            }
        })

        const currency = await currencyRes.json();

        formData.currency = currency[0].currency.code
        formData.latitude = latLon[0].latitude
        formData.longitude = latLon[0].longitude

        await fbUpdate("/trips/" + tripId, formData)

        // IF SUCCESSFUL...

        if (from !== oldFrom || to !== oldTo) {
            store.dispatch(authActions.resetPlanner({
                tripId,
                from,
                to
            }))
        }
        store.dispatch(authActions.updateTrip({
            tripId,
            trip: formData
        }))
        
        return null

    } else if (purpose === "updatePlanner") {
        formData.plannerId = data.get("plannerId") || purposeId
        const { plannerId, plannerDate, ...formObject } = formData

        const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${formObject.address}&apiKey=${geocodingKey}`)
        const json = await res.json()
        formObject.lat = json.features[0].properties.lat
        formObject.lon = json.features[0].properties.lon

        await fbUpdate("/trips/" + tripId + "/planner/" + plannerDate + "/plans/" + plannerId, formObject)

        // IF SUCCESSFUL...

        store.dispatch(authActions.updatePlanner({
            tripId,
            plannerId,
            plannerDate,
            planner: formObject
        }))

        return null

    }

}