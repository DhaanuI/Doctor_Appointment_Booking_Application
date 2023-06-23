const url = "https://pococare-assignment.vercel.app/"

const backendURL = "https://pococare1.onrender.com/"

if (!localStorage.getItem("token")) {
    alert("Please login")
    window.location.href = `./signin.html`;
}

document.querySelector(".doctor-name").innerHTML = "Hi " + localStorage.getItem('name')

const id = localStorage.getItem('id')
async function fetchAppointments(id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${backendURL}appointments/docapp/${id}`, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });
        const data = await response.json()

        renderAppointments(data.Appointments)
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

fetchAppointments(id)

function renderAppointments(appointments) {
    const appointmentInfoContainer = document.querySelector('.appointment-info');

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

            const patientImage = document.createElement('img');
            patientImage.src = appointment.patientId.image;
            patientImage.className = 'doctor-image';
            const appointmentInfo = document.createElement('p');
            appointmentInfo.textContent = `Name: ${appointment.patientId.name} | Date: ${formattedDate} | Start Time: ${appointment.startTime}  | End Time: ${appointment.endTime}`;


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

            appDiv.append(patientImage, appointmentInfo, cancelAppointmentBtn)

            appointmentInfoContainer.append(appDiv)
        });
    }
}


const logoutButton = document.querySelector('.logout-btn');

logoutButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');

    fetch(`${backendURL}doctors/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = `./signin.html`;
            } else {
                console.log('Logout request failed.');
            }
        })
        .catch(error => {
            console.log('An error occurred during logout:', error);
        });
});