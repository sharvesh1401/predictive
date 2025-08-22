﻿from fastapi import FastAPI
app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/readiness")
def readiness():
    return {"status": "ready"}
