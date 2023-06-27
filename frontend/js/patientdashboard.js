const url = "https://pococare-assignment.vercel.app/"

const backendURL = "https://pococare1.onrender.com/"


if (!localStorage.getItem("token")) {
    alert("Please login")
    window.location.href = `./signin.html`
}

document.querySelector(".patient-name").innerHTML = "Hi " + localStorage.getItem('name')

const id = localStorage.getItem('id')
async function fetchAppointments(id) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${backendURL}appointments/patapp/${id}`, {
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

            const docImage = document.createElement('img');
            docImage.src = appointment.doctorId.image;
            docImage.className = 'doctor-image';
            const appointmentInfo = document.createElement('p');
            appointmentInfo.textContent = `Name: ${appointment.doctorId.name} | Date: ${formattedDate} | Start Time: ${appointment.startTime}  | End Time: ${appointment.endTime}`;
            const editAppointmentBtn = document.createElement('button');
            editAppointmentBtn.className = 'edit-appointment-btn';
            editAppointmentBtn.textContent = 'Edit';

            editAppointmentBtn.addEventListener('click', () => {
                openModal(appointment._id, "patch");
            });

            const cancelAppointmentBtn = document.createElement('button');
            cancelAppointmentBtn.className = 'cancel-appointment-btn';
            cancelAppointmentBtn.textContent = 'Cancel';

            cancelAppointmentBtn.addEventListener('click', () => {
                const confirmDelete = confirm('Are you sure you want to delete this appointment?');
                if (confirmDelete) {
                    alert("Request is received, Allow a moment to process")
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
                                fetchAppointments(id)
                            } else {
                                console.error('Failed to delete appointment');
                            }
                        })
                        .catch(error => {
                            console.error('Error occurred while deleting appointment:', error);
                        });
                }
            });
            appDiv.append(docImage, appointmentInfo, editAppointmentBtn, cancelAppointmentBtn)
            appointmentInfoContainer.append(appDiv)
        });
    }
}



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

    const doctorsContainer = document.querySelector('.doctors-container');

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
        if (doctor.videoCall == "YES") {
            const videoCall = document.createElement('button');
            videoCall.className = 'video-btn';
            videoCall.textContent = 'Available for a Video Consultation NOW';
            doctorCard.appendChild(videoCall);

            videoCall.addEventListener('click', function () {
                localStorage.setItem("email", doctor.email)
                window.location.href = `./video.html`
            });
        }
        else {
            const videoCallNotavailable = document.createElement('button');
            videoCallNotavailable.className = 'video-btn-notavailable';
            videoCallNotavailable.textContent = 'Video Call Not Available';
            doctorCard.appendChild(videoCallNotavailable);
        }

        const bookButton = document.createElement('button');
        bookButton.className = 'book-btn';
        bookButton.textContent = 'Book Appointment';
        bookButton.addEventListener('click', function () {
            openModal(doctor._id, "post");
        });
        doctorCard.appendChild(bookButton);

        doctorsContainer.appendChild(doctorCard);
    });
}


fetchDoctors();


function openModal(doctorId, string) {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = `
<div class="modal-content">
  <div class="modal-header">
    <h2>Book Appointment</h2>
    <span id="modal-close" class="modal-close">&times;</span>
  </div>
  <div>
    <p>Date: </p>
    <input type="date" id="my-date-picker">

    <p>Select Time Interval:</p>
    <div class="time-interval">
      <input type="radio" name="time" value="10 AM-11 AM" id="time-1">
      <label for="time-1">10 AM-11 AM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="11 AM-12 PM" id="time-2">
      <label for="time-2">11 AM-12 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="1 PM-2 PM" id="time-3">
      <label for="time-3">1 PM-2 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="2 PM-3 PM" id="time-4">
      <label for="time-4">2 PM-3 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="3 PM-4 PM" id="time-5">
      <label for="time-5">3 PM-4 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="4 PM-5 PM" id="time-6">
      <label for="time-6">4 PM-5 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="6 PM-7 PM" id="time-7">
      <label for="time-7">6 PM-7 PM</label>
    </div>
    <div class="time-interval">
      <input type="radio" name="time" value="7 PM-8 PM" id="time-8">
      <label for="time-8">7 PM-8 PM</label>
    </div>
    <button id="book-appointment-btn">Confirm Appointment</button>
  </div>
</div>
`;


    modal.style.display = "block"

    document.getElementById("modalDiv").appendChild(modal);
    const modalClose = document.getElementById('modal-close');
    modalClose.addEventListener('click', closeModal);
    const datePicker = document.getElementById("my-date-picker");

    const today = new Date().toISOString().split("T")[0];

    datePicker.setAttribute("min", today);

    const confirmBtn = document.getElementById('book-appointment-btn');
    confirmBtn.addEventListener('click', function () {

        const selectedTime = document.querySelector('input[name="time"]:checked').value;
        const selectedDate = document.getElementById('my-date-picker').value;
        const patientId = localStorage.getItem('id');

        //  10 AM-11 AM
        //  11 AM-12 PM
        //  1 PM-2 PM
        //  2 PM-3 PM
        //  3 PM-4 PM
        //  4 PM-5 PM
        //  6 PM-7 PM
        //  7 PM-8 PM
        console.log(selectedTime)
        if (selectedTime == "10 AM-11 AM") {
            start = "10:00:00"
            endTime = "11:00:00"
        }
        else if (selectedTime == "11 AM-12 PM") {
            start = "11:00:00"
            endTime = "12:00:00"
        }
        else if (selectedTime == "1 PM-2 PM") {
            start = "13:00:00"
            endTime = "1:00:00"
        }
        else if (selectedTime == "2 PM-3 PM") {
            start = "14:00:00"
            endTime = "15:00:00"
        }
        else if (selectedTime == "3 PM-4 PM") {
            start = "15:00:00"
            endTime = "16:00:00"
        }
        else if (selectedTime == "4 PM-5 PM") {
            start = "16:00:00"
            endTime = "17:00:00"
        }
        else if (selectedTime == "6 PM-7 PM") {
            start = "18:00:00"
            endTime = "19:00:00"
        }
        else if (selectedTime == "7 PM-8 PM") {
            start = "19:00:00"
            endTime = "20:00:00"
        }

        const data = {
            doctorId: doctorId,
            date: selectedDate,
            startTime: start,
            endTime: endTime,
            patientId: patientId
        };

        const token = localStorage.getItem("token")
        if (string == "post") {
            spinner.removeAttribute('hidden');
            alert("Request is received, Allow a moment to process")
            fetch(`${backendURL}appointments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    spinner.setAttribute('hidden', '');
                    console.log('Appointment added successfully:', result);
                    alert("Appointment added successfully")
                    closeModal();
                    fetchAppointments(id)
                })
                .catch(error => {
                    console.error('Error adding appointment:', error);
                    closeModal();
                });
        }
        else if (string == "patch") {
            spinner.removeAttribute('hidden');
            alert("Request is received, Allow a moment to process")
            const data = {
                date: selectedDate,
                startTime: start,
                endTime: endTime,
            };
            fetch(`${backendURL}appointments/update/${doctorId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    spinner.setAttribute('hidden', '');
                    console.log('Appointment modified successfully:', result);
                    alert("Appointment modified successfully")
                    closeModal();
                    fetchAppointments(id)
                })
                .catch(error => {
                    console.error('Error modifying appointment:', error);
                    closeModal();
                });
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.remove();
    }
}


const logoutButton = document.querySelector('.logout-btn');

logoutButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');

    fetch(`${backendURL}patients/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = `../index.html`;
                alert("Logging you out")
            } else {
                console.log('Logout request failed.');
            }
        })
        .catch(error => {
            console.log('An error occurred during logout:', error);
        });
});

