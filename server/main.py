from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from database import engine  # Import the database engine

# Import your routers
from routers import support
from routers import cart  # Import the new cart router

app = FastAPI()

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Create Database Tables ----
# This looks at all your SQLModel models (like your Cart model)
# and creates the tables in the database if they don't exist.
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# ---- Register Routers ----
app.include_router(support.router)
app.include_router(cart.router)  # Register the cart router
