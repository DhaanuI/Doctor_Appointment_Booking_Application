const url = "https://pococare-assignment.vercel.app/"

const backendURL = "https://pococare1.onrender.com/"


function showDoctorForm() {
    document.getElementById('doctorForm').style.display = 'block';
    document.getElementById('patientForm').style.display = 'none';
}

function showPatientForm() {
    document.getElementById('doctorForm').style.display = 'none';
    document.getElementById('patientForm').style.display = 'block';
}


const patientForm = document.getElementById('patientForm');

patientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const patientName = document.getElementById('patientName').value;
    const patientEmail = document.getElementById('patientEmail').value;
    const patientPassword = document.getElementById('patientPassword').value;
    const patientImage = document.getElementById('patientImage').value;


    const patientData = {
        name: patientName,
        email: patientEmail,
        password: patientPassword,
        image: patientImage
    };

    fetch(`${backendURL}patients/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Registeration Successfull")
            window.location.href = `${url}frontend/view/signin.html`
        })
        .catch(error => {
            console.error(error);
        });
});

const doctorForm = document.getElementById('doctorForm');

doctorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const doctorName = document.getElementById('doctorName').value;
    const doctorEmail = document.getElementById('doctorEmail').value;
    const doctorPassword = document.getElementById('doctorPassword').value;
    const doctorSpecialisation = document.getElementById('doctorSpecialisation').value;
    const doctorImage = document.getElementById('doctorImage').value;

    const doctorData = {
        name: doctorName,
        email: doctorEmail,
        password: doctorPassword,
        specialisation: doctorSpecialisation,
        image: doctorImage
    };

    fetch(`${backendURL}doctors/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Registeration Successfull")
            window.location.href = `${url}frontend/view/signin.html`
        })
        .catch(error => {
            console.error(error);
        });
});
