# Pococare_assignment

A Doctor's Appointment Booking System -lets you register and Login and be able to view Doctors, book appointment, view/reschedule and also delete appointments.

## Tech Stacks used:
[![My Skills](https://skillicons.dev/icons?i=js,nodejs,express,mongodb,html,css)](https://skillicons.dev)

## Tools used:
[![My Skills](https://skillicons.dev/icons?i=vercel,github)](https://skillicons.dev)
<img alt="Coder GIF" height=50 width=80 src="https://www.w3schools.com/whatis/img_npm.jpg" />




# Live Demo Link [https://pococare-assignment.vercel.app/](https://pococare-assignment.vercel.app/)

# Backend deployed using RENDER https://pococare1.onrender.com/

# Home Page
![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/ffc52ffb-cc7b-48c6-8aec-cf771747e08b)

# Click on Sign Up to Register
![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/fa1540bf-e61b-4a20-aa09-0b3aae72ed93)

If you are a Doctor

![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/52f852c3-191b-4473-8f3f-08f79d99e14c)

If you are a Patient

![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/f30893d8-d55d-4e89-a487-1fa42342c0ef)


# Click on Login to signin

![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/55acee29-25ed-43a8-b918-9362cb833a80)

# Patient Dashboard - Authenticated Route
![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/43c24b4a-126b-4e0c-8345-f0aa88927182)

# Appointments  - Authenticated Route
![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/2398e8c2-2204-4595-bbe0-d4035e59fb2f)

![image](https://github.com/DhaanuI/Pococare_assignment/assets/112754832/0d266a7b-6265-47dd-bd84-8057238956cb)





 You can also click For VIDEO CONSULTATION which will redirect to another page which is a ROOM where Patient and Doctor can have a meet via Video**

 Once the patient started the Video, It will trigger an email to DOCTOR with the MEETING LINK so DOCTOR can IMMEDIATELY JOIN**



# How To:

If you wish to run this project on your local machine

Follow the given steps:

* Clone our repository https://github.com/DhaanuI/Pococare_assignment

* Open our code in VS code

* Then do npm install to require the necessary packages and dependencies

* Go to Backend folder - cd backend

* do npm run server

* Congrats! you have successfully started the application.

## API end points

api - https://pococare1.onrender.com/


| METHOD | ENDPOINT | DESCRIPTION | STATUS CODE |
| --- | --- | --- | --- |
| POST | api/patients/signup | This endpoint allow Patients to register. | 201 |
| POST | api/patients/login | This endpoint allow Patients to login. | 201 |
| PATCH | api/patients/update/:id | To update user
| DELETE | api/patients/delete/:id | To delete user
| GET | api/patients/all | To get all users | 200
| POST | api/patients/logout | To log user out
| POST | api/doctors/signup | This endpoint allow Doctors to register. | 201 |
| POST | api/doctors/login | This endpoint allow Doctors to login. | 201 |
| PATCH | api/doctors/update/:id | To update user
| DELETE | api/doctors/delete/:id | To delete user
| GET | api/doctors/all | To get all users | 200
| POST | api/doctors/logout | To log user out
| GET | api/appointments/ | To get all appointments | 200
| POST | api/appointments/add | This endpoint allow patients to add appointment. | 201 |
| PATCH | api/appointments/update/:id | To update appointment
| DELETE | api/appointments/delete/:id | To delete appointment
| GET | api/appointments/docapp/:id | To get the appointments based on specific Doctor | 200
| GET | api/appointments/patapp/:id | To get the appointments based on specific Patient | 200






# Thanks for your time, have a nice day!!!!



