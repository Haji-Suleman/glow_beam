from sqlmodel import create_engine, Session

# 1. Define your database URL
# This example uses SQLite, which creates a local file named "database.db"
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 2. Create the engine
# connect_args={"check_same_thread": False} is only required for SQLite
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False}, echo=True)


# 3. Create the dependency function that FastAPI will use
def get_session():
    with Session(engine) as session:
        yield session
