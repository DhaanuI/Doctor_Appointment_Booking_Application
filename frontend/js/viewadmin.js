const backendURL = "https://pococare1.onrender.com/"

document.querySelector(".admin-name").innerHTML = "Hi " + localStorage.getItem('name')

async function fetchDoctors() {
    try {
        const response = await fetch(`${backendURL}doctors/all`);
        const data = await response.json();
        renderDoctors(data.Doctors);

    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}

function renderDoctors(doctors) {

    const doctorsContainer = document.querySelector('.container');
    doctorsContainer.innerHTML = ""
    doctors.forEach(doctor => {

        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';

        const doctorImage = document.createElement('img');
        doctorImage.src = doctor.image;
        doctorImage.alt = `Doctor ${doctor.id}`;
        doctorCard.appendChild(doctorImage);

        const doctorName = document.createElement('h2');
        doctorName.className = 'doctor-name';
        doctorName.textContent = doctor.name;
        doctorCard.appendChild(doctorName);

        const doctorEmail = document.createElement('p');
        doctorEmail.className = 'doctor-email';
        doctorEmail.textContent = doctor.email;
        doctorCard.appendChild(doctorEmail);

        const doctorSpecialization = document.createElement('p');
        doctorSpecialization.className = 'doctor-specialization';
        doctorSpecialization.textContent = "Specialization: " + doctor.specialization;
        doctorCard.appendChild(doctorSpecialization);

        const videoCallAvailability = document.createElement('p');
        videoCallAvailability.className = "change"+doctor._id;
        videoCallAvailability.textContent = "Video Call Availability: " + doctor.videoCall;
        doctorCard.appendChild(videoCallAvailability);

        const videoToggle = document.createElement('button');
        videoToggle.textContent = 'Change Availability';
        videoToggle.className = 'doctor-change';

        videoToggle.addEventListener('click', (e) => {
            let obj = {}
            let id= doctor._id
            if (document.getElementsByClassName(`change${doctor._id}`)[0].innerText == "Video Call Availability: YES") {
                obj = {
                    videoCall: "NO",
                    role: "admin"
                }
            }
            else {
                obj = {
                    videoCall: "YES",
                    role: "admin"
                }
            }
           
            fetch(`${backendURL}doctors/update/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
                .then(response => {
                    if (response.ok) {
                        alert("Video Call Availability changed")
                        fetchDoctors()
                    } else {
                        alert("Error")
                    }
                })
                .catch(error => {
                    console.log('An error', error);
                });
        });

        doctorCard.appendChild(videoToggle);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'doctor-remove';
        removeButton.addEventListener('click', () => {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'admin' })
            };

            fetch(`http://localhost:8080/doctors/delete/${doctor._id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Doctor removed")
                        patientCard.remove();
                    } else {
                        console.error('Error deleting doctor:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        doctorCard.appendChild(removeButton);

        doctorsContainer.appendChild(doctorCard);
    });
}


async function fetchPatients() {
    try {
        const response = await fetch(`${backendURL}patients/all`);
        const data = await response.json();
        renderPatients(data.Patients);

    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}

function renderPatients(patients) {

    const Container = document.querySelector('.container');
    Container.innerHTML = ""

    patients.forEach(patient => {
        const patientCard = document.createElement('div');
        patientCard.className = 'patient-card';

        const patientImage = document.createElement('img');
        patientImage.src = patient.image;
        patientImage.alt = `patient ${patient.id}`;
        patientCard.appendChild(patientImage);

        const patientName = document.createElement('h2');
        patientName.className = 'patient-name';
        patientName.textContent = "Name:" + patient.name;
        patientCard.appendChild(patientName);

        const patientEmail = document.createElement('p');
        patientEmail.className = 'patient-email';
        patientEmail.textContent = "Email:" + patient.email;
        patientCard.appendChild(patientEmail);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'patient-remove';
        removeButton.addEventListener('click', () => {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'admin' })
            };

            fetch(`http://localhost:8080/patients/delete/${patient._id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Patient removed")
                        patientCard.remove();
                    } else {

                        console.error('Error deleting patient');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
        patientCard.appendChild(removeButton);



        Container.appendChild(patientCard);
    });
}


async function fetchAppointments() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${backendURL}appointments`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        const data = await response.json()
        console.log(data)
        renderAppointments(data.Appointments)
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

function renderAppointments(appointments) {
    const appointmentInfoContainer = document.querySelector('.container');
    appointmentInfoContainer.innerHTML = ""
    if (appointments.length === 0) {
        appointmentInfoContainer.textContent = 'No Appointments';
    } else {
        appointmentInfoContainer.innerHTML = '';

        appointments.forEach(appointment => {
            let appDiv = document.createElement("div")
            const dateString = appointment.date;
            const date = new Date(dateString);

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            const docImage = document.createElement('img');
            docImage.src = appointment.doctorId.image;
            docImage.className = 'doctor-image';

            const patientImage = document.createElement('img');
            patientImage.src = appointment.patientId.image;
            patientImage.className = 'patient-image';

            const appointmentInfo = document.createElement('p');
            appointmentInfo.textContent = `Name: ${appointment.doctorId.name} | Date: ${formattedDate} | Start Time: ${appointment.startTime}  | End Time: ${appointment.endTime}`;


            const cancelAppointmentBtn = document.createElement('button');
            cancelAppointmentBtn.className = 'cancel-appointment-btn';
            cancelAppointmentBtn.textContent = 'Cancel';

            cancelAppointmentBtn.addEventListener('click', () => {
                const confirmDelete = confirm('Are you sure you want to delete this appointment?');
                if (confirmDelete) {
                    const appointmentId = appointment._id;
                    const token = localStorage.getItem('token');

                    fetch(`${backendURL}appointments/delete/${appointmentId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                console.log('Appointment deleted');
                                alert('Appointment deleted')
                                fetchAppointments()
                            } else {
                                console.error('Failed to delete appointment');
                            }
                        })
                        .catch(error => {
                            console.error('Error occurred while deleting appointment:', error);
                        });
                }
            });

            appDiv.append(docImage, patientImage, appointmentInfo, cancelAppointmentBtn)
            appointmentInfoContainer.append(appDiv)
        });
    }
}


document.getElementById("viewDoc").addEventListener("click", () => {
    fetchDoctors();
})

document.getElementById("viewPat").addEventListener("click", () => {
    fetchPatients();
})

document.getElementById("viewApp").addEventListener("click", () => {
    fetchAppointments();
})

const logoutButton = document.querySelector('.logout-btn');

logoutButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');

    fetch(`${backendURL}admin/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = `./admin.html`;
                alert("Logging you out")
            } else {
                console.log('Logout request failed.');
            }
        })
        .catch(error => {
            console.log('An error occurred during logout:', error);
        });
});


















changeVideocallButton.addEventListener('click', () => {
    const id = localStorage.getItem('id')
    let obj = {}
    if (document.querySelector("#videoCall").textContent == "YES") {
        obj = {
            videoCall: "NO",
            role: "doctor"
        }
    }
    else {
        obj = {
            videoCall: "YES",
            role: "doctor"
        }
    }

    spinner.removeAttribute('hidden');
    fetch(`${backendURL}doctors/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(response => {
            if (response.ok) {
                spinner.setAttribute('hidden', '');
                alert("Successfull")
                const id = localStorage.getItem('id')

                fetchYourdata(id)
            } else {
                alert("Error")
            }
        })
        .catch(error => {
            console.log('An error', error);
        });
});