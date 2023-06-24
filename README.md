# Study program selection tool
This repository contains a prototype of a study program selection tool. The tool consists of two elements: the backend, a Django project with the default SQLite database, and the front end, which is created using React JS.

# Usage
## Backend
The backend is written in Django using Django Rest Framework. To setup, install the requirements in `requirements.txt`, navigate to the backend folder (where `manage.py` is located) and run `python manage.py migrate`. To run the development server, run `python manage.py runserver`.

In order to be able to add, edit or delete entries in the database, a superuser should be created. This can be done by running the command `python manage.py createsuperuser`. Running the development server and navigating to `/admin/` grants access to the admin panel.

## Frontend
The frontend of this project is built using Vite and React. To set up, navigate to the `backend` folder and run `npm install`. The development server can then be started by running `npm run dev`.

# Development
## Backend
This guide assumes familiarity with both Django and the Django Rest Framework. Most of the work done on this project should be self-explanatory if these frameworks are known.

In the backend folder you will find two more folders: another folder called `backend` (this is the folder that contains `settings.py`, `urls.py`, etc.) and a folder called `dss`. The bulk of the backend of this application is located in the `dss` folder. This folder contains the models for the decision tree and AHP-based decision support systems (located in `models.py`). Here, you will also find the admin forms for these models (`admin.py`), and the serializers (`serializers.py`) used to generate the JSON that will be returned by the views (`views.py`).

### Endpoints
`/decision-trees/`: Used to retrieve all decision trees.

`/decision-trees/{id}/`: Used to retrieve a specific decision tree.

`/study-programs/`: Used to retrieve all study programs.

`/study-programs/{id}/`: Used to retrieve a specific study program.

`/nodes/`: Used to retrieve all nodes and their associated questions, answers and/or study programs.

`/nodes/{id}/`: Used to retrieve a specific node and its associated question, answers and/or study program.

`/criteria/`: Used to retrieve all criteria.

`/criteria/{id}`: Used to retrieve a specific criterium.

## Frontend
The frontend can be found in `/frontend/` and is built entirely in React JS. The main `App` component and its child component that allows the user to select one of the three implemented decision making methods, `SystemSelector`, are located in `/frontend/src/App.jsx`. The components necessary for each of the three decision making methods are located in the respective files in `/frontend/src/components/`.

## Environment variables
Both the frontend and the backend require environment variables to be present in a `.env` file at the project's root. Here, three environment variables should be present:

`GPT_API_KEY` should contain the key for OpenAI's API.

`DJANGO_SECRET_KEY` should contain the secret key to be used in `settings.py`.

`VITE_API_URL` should contain the URL from which the backend can be reached.

# Deployment
The backend can be deployed following the standard Django deployment procedure ([docs](https://docs.djangoproject.com/en/4.2/howto/deployment/)).

The frontend can be built by running `npm run build`. All that is left to do is serving the application files that appear in the `dist` folder with `index.html` as an entry point.

# TODO
- The frontend could use a refactor, especially the components for PAW-PAW and the decision tree.
