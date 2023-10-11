import os
from dotenv import load_dotenv  
from fastapi import FastAPI, Depends, Security, HTTPException
from fastapi_auth0 import Auth0, Auth0User
import models, schemas, crud
from database import SessionLocal, engine
from sqlalchemy.orm import Session



models.Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

auth0_domain = "dev-8ny855k43qx6hq5a.us.auth0.com"
auth0_api_audience = "test2"

auth = Auth0(domain=auth0_domain, api_audience=auth0_api_audience
            #  , scopes={'read:blabla': 'Read BlaBla resource'}
             )

load_dotenv()  

@app.get("/")
async def root():
    return {"message":  "root page"  }

@app.get("/public")
async def get_public():
    return {"message": "Anonymous user"}

@app.get("/login", dependencies=[Depends(auth.implicit_scheme)])
async def get_secure(user: Auth0User = Security(auth.get_user)):
    return {"message": f"{user}"}

# @app.get("/secure/blabla", dependencies=[Depends(auth.implicit_scheme)])
# async def get_secure_scoped(user: Auth0User = Security(auth.get_user, scopes=["read:blabla"])):
#     return {"message": f"{user}"}

# @app.get("/secure/blabla2")
# async def get_secure_scoped2(user: Auth0User = Security(auth.get_user, scopes=["read:blabla"])):
#     return {"message": f"{user}"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users