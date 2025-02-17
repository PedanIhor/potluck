To run the backend server:

```
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

To run the frontend:

```
cd frontend
npm install
npm run build
npm run start
```
