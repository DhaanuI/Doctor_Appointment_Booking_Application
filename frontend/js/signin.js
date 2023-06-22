const url = "https://pococare-assignment.vercel.app/"

const backendURL = "https://pococare1.onrender.com/"



const patientForm = document.querySelector(".patient");

patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let enteredEmail = document.getElementById("patientEmail").value
    let enteredPass = document.getElementById("patientPassword").value

    if (enteredEmail == "" || enteredPass == "") {
        return alert("Enter all the fields")
    }
    let obj = {
        email: enteredEmail,
        password: enteredPass
    }

    let verifyingLogin = await fetch(`${backendURL}patients/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })

    let res = await verifyingLogin.json()

    if (res.token) {
        let token = res.token;
        localStorage.setItem("token", token)
        localStorage.setItem("name", res.name)
        localStorage.setItem("id", res.id)
        alert(res.message)
        enteredEmail == ""
        enteredPass == ""

        window.location.href = `${url}view/patientdashboard.html`
    }
    else {
        alert(res.message)
    }
})


const doctorForm = document.querySelector(".doctor");

doctorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let enteredEmail = document.getElementById("doctorEmail").value
    let enteredPass = document.getElementById("doctorPassword").value

    if (enteredEmail == "" || enteredPass == "") {
        return alert("Enter all the fields")
    }
    let obj = {
        email: enteredEmail,
        password: enteredPass
    }

    let verifyingLogin = await fetch(`${backendURL}doctors/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })

    let res = await verifyingLogin.json()

    if (res.token) {
        let token = res.token;
        localStorage.setItem("token", token)
        localStorage.setItem("name", res.name)
        localStorage.setItem("id", res.id)
        alert(res.message)
        enteredEmail == ""
        enteredPass == ""

        window.location.href = `${url}view/doctordashboard.html`
    }
    else {
        alert(res.message)
    }
})

