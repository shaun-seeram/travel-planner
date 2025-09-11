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
    const purpose = data.get("purpose")
    const purposeId = new Date().getTime()
    const tripId = params.id
    const formData = Object.fromEntries(data.entries())

    if (purpose === "updateAccomodation") {
        formData.accomodationId = data.get("accomodationId") || purposeId

        const { name, street, city, state, zip, notes, accomodationId } = formData

        await fbUpdate("/trips/" + tripId + "/accomodations/" + accomodationId, {
            name,
            street,
            city,
            state,
            zip,
            notes
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateAccomodation({
            tripId,
            accomodationId,
            accomodation: {
                name,
                street,
                city,
                state,
                zip,
                notes
            }
        }))
        return null

    } else if (purpose === "updateFlight") {
        formData.flightId = data.get("flightId") || purposeId

        const { flightId, airline, fromAirport, toAirport, flightNumber, departureDate, boarding, notes } = formData

        const splitTime = boarding.split(":")
        let meridiem = " am"

        if (splitTime[0] === "00") { splitTime[0] = "12" }
        if (+splitTime[0] > 12) {
            splitTime[0] = +splitTime[0] - 12
            meridiem = " pm"
        }

        const stringifiedBoarding = splitTime.join(":") + meridiem

        await fbUpdate("/trips/" + tripId + "/flights/" + flightId, {
            airline,
            fromAirport,
            toAirport,
            flightNumber,
            departureDate,
            boarding,
            stringifiedBoarding,
            notes
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateFlight({
            tripId,
            flightId,
            flight: {
                airline,
                fromAirport,
                toAirport,
                flightNumber,
                departureDate,
                boarding,
                stringifiedBoarding,
                notes
            }
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

        const { name, cost, notes, expenseId } = formData

        await fbUpdate("/trips/" + tripId + "/budget/expenses/" + expenseId, {
            name,
            cost: +cost,
            notes
        })

        // IF SUCCESSFUL...
        store.dispatch(authActions.updateExpense({
            tripId,
            expenseId,
            expense: {
                name,
                cost: +cost,
                notes
            }
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

        await fbUpdate("/trips/" + tripId, {
            city,
            country,
            from,
            to,
            currency: currency[0].currency.code,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        })

        // IF SUCCESSFUL...

        if (from !== oldFrom || to !== oldTo) {
            store.dispatch(authActions.resetPlanner({
                tripId,
                from: from,
                to: to
            }))
        }
        store.dispatch(authActions.updateTrip({
            tripId,
            city,
            country,
            from,
            to,
            currency,
            latitude: latLon[0].latitude,
            longitude: latLon[0].longitude
        }))
        return null

    } else if (purpose === "updatePlanner") {
        formData.plannerId = data.get("plannerId") || purposeId
        const { plannerId, plannerDate, place, address, notes } = formData

        const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${geocodingKey}`)
        const json = await res.json()
        const lat = json.features[0].properties.lat
        const lon = json.features[0].properties.lon

        await fbUpdate("/trips/" + tripId + "/planner/" + plannerDate + "/plans/" + plannerId, {
            place,
            address,
            notes,
            lat,
            lon
        })

        // IF SUCCESSFUL...

        store.dispatch(authActions.updatePlanner({
            tripId,
            plannerId,
            plannerDate,
            place,
            address,
            notes,
            lat,
            lon
        }))

        return null

    }

}