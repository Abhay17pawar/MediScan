<div align="center">
   <img src="https://www.mediscan.es/wp-content/uploads/2020/10/mediscan-768x231.png" width="150px" alt="Project Logo" />
</div>


## Description

An AI-powered tool that lets patients scan prescriptions and ask questions about their medications.
Uses OCR and natural language processing for instant, easy-to-understand answers.
Upcoming features include smart reminders for timely medication intake.

## Features

- 📸 Prescription Scanning with Pytesseract – Uses OCR to extract text from prescription images.
- 💊 Medication Insights – Understand dosage, purpose, side effects, and interactions.
- 🧠 AI-Powered Q&A – Patients can ask natural-language questions about their medications.
- ⏰ Smart Reminders (Coming Soon) – Get timely alerts to take medications.

## Tech Stack

**Client:** NextJS, TypeScript, TailwindCSS

**Server:** FastAPI

**DataBase:** NeonDB

**Pytesseract (OCR)**

## Screenshots

![landingPage](https://github.com/Abhay17pawar/MediScan/blob/main/public/landingPage.png)

![landingPage](https://github.com/Abhay17pawar/MediScan/blob/main/public/Screenshot%202025-04-26%20012923.png)

![landingPage](https://github.com/Abhay17pawar/MediScan/blob/main/public/Screenshot%202025-04-26%20013143.png)


## Installation

## Frontend : 
Install the project with npm:

```bash
npm install 
npm run dev
```

## Backend : 
cd backend

pip install -r requirements.txt

uvicorn app:app --reload

## API Reference

### Get User Prescriptions

Retrieve a list of all prescriptions for a user.


```http
GET /user-prescriptions?user_email={userEmail}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_email` | `string` | **Required**. The email of the user whose prescriptions you want to fetch.|

### Extract Text from Prescription

Extract text from a prescription image using OCR.

```http
POST /extract-text
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `file`      | `FormData` | **Required**. The image file to be processed by the OCR engine. |

## Configuration Setup

Backend Environment Variables

For the backend, create a .env file and add the following environment variables:

```bash
POPPLER_PATH=
TESSERACT_ENGINE_PATH=
DATABASE_URL=
```

Frontend Environment Variables

For the frontend, create a .env file in the root of your frontend project and add the following environment variables:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_OPENROUTER_API_KEY=
```

## License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more details on terms and conditions.

Feel free to use and contribute to the project under these terms!




