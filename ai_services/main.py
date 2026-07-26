from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from routes.name_op import router 
# from routes.pdf_op import router as get_pdf
from routes.recommend_paper import router as recommend_papers
from routes.pdf_op import router as get_pdf

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(name_op,prefix="/name")
# app.include_router(pdf_op,prefix="/pdf")
app.include_router(recommend_papers,prefix="/get_papers")
app.include_router(get_pdf,prefix="/get_pdf")



# #debug
# import traceback
# from fastapi import FastAPI, Request
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from routes.recommend_paper import router as recommend_papers
# from routes.pdf_op import enter_pdf

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Global Exception Middleware to force print hidden stack traces
# @app.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     print("\n" + "="*50)
#     print("❌ DETECTED BACKEND EXCEPTION CRASH:")
#     print("="*50)
#     traceback.print_exc()  # Prints the full stack trace to terminal
#     print("="*50 + "\n")
#     return JSONResponse(
#         status_code=500,
#         content={"success": False, "error": str(exc), "details": "Check server terminal logs."}
#     )

# app.include_router(recommend_papers, prefix="/get_query")

# app.include_router(enter_pdf,prefix="get_pdf")
