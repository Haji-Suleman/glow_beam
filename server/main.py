import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables

# Import routers (this also imports the models they use, so the tables get registered)
from routers import support
from routers import cart
from routers import admin

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()  # creates missing tables on startup
    yield


app = FastAPI(lifespan=lifespan)

# ---- CORS ----
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Production frontend URL(s), comma separated, set on the host:
# FRONTEND_URLS=https://yourshop.com,https://www.yourshop.com
extra = os.getenv("FRONTEND_URLS", "")
origins += [u.strip().rstrip("/") for u in extra.split(",") if u.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
print("ADMIN_KEY loaded:", bool(os.getenv("ADMIN_KEY")))


@app.get("/")
def health():
    return {"status": "ok"}


# ---- Routers ----
app.include_router(support.router)
app.include_router(cart.router)
