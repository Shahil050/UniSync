from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routes.recommend_paper import router as recommend_paper
from routes.get_pdf import router as get_pdf
from routes.register_user import router as register_user
from routes.recommend_user import router as recommend_user

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_paper,prefix="/recommend_paper")
app.include_router(get_pdf)
app.include_router(register_user)
app.include_router(recommend_user)




