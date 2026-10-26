from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import support  # Import the support router

app = FastAPI()

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # CRA
        "http://localhost:5173",  # Vite
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Register Routers ----
app.include_router(support.router)
# When you add new files to the routers folder, just import and include them here:
# app.include_router(users.router)
# app.include_router(products.router)
