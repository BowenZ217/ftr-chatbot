# ftr-chatbot

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/flask-%23000000.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)

## Running Instructions

To set up and run the FTR-chatbot application, follow the instructions for the front-end client and back-end server.

1. Clone the repository:

```shell
git clone https://github.com/BowenZ217/ftr-chatbot.git
cd ftr-chatbot
```

### Front-end Client

1. Navigate to the front-end folder:

```shell
cd frontend
```

2. Install the dependencies:

```shell
npm install
```

3. Start the development server:

```shell
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Back-end Server

1. Navigate to the back-end folder:

```shell
cd backend
```

2. Install the dependencies:

```shell
pip install -r requirements.txt
```

3. Configure Environment Variables:

- Locate the `backend/.env.sample` file and rename it to `.env` within the same directory.
- Open the newly renamed `.env` file and update the placeholders with your specific environment configurations.
- For testing purposes, you can use a [free database provider](https://www.freesqldatabase.com/) to quickly set up a database without cost.

4. Start the development server:

```shell
python ./run.py
```
