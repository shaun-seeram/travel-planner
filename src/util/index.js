export const verifyEmail = (email) => {

    const errorChecking = [
        { validity: email.trim().length === 0, message: "Please enter an email." },
        { validity: email.trim().length < 6 && email.trim().length > 0, message: "Please enter a valid email." },
        { validity: !email.includes("@") || !email.includes("."), message: "Ensure your email includes both a '@' and '.' character." },
        { validity: email.includes(" "), message: "Ensure your email doesn't include and spaces." },
    ]

    const validation = { valid: true, errors: [] }

    for (let check of errorChecking) {
        if (check.validity) {
            validation.valid = false;
            validation.errors.push(check.message);
        }
    }

    return validation

}

export const verifyPassword = (password) => {

    const errorChecking = [
        { validity: password.trim().length === 0, message: "Please enter a password." },
        { validity: password.trim().length < 6 && password.trim().length > 0, message: "Passwords need to be 6 characters or greater." },
        { validity: password.includes(" "), message: "Ensure your password doesn't include and spaces." },
    ]

    const validation = { valid: true, errors: [] }

    for (let check of errorChecking) {
        if (check.validity) {
            validation.valid = false;
            validation.errors.push(check.message);
        }
    }

    return validation

}

export const plannerMapping = (from, to) => {
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

    return planner
}