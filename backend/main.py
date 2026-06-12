from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

import models
import database
from ai_generator import generate_strategy_content

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

class StrategyRequest(BaseModel):
    business_name: str
    industry: str
    budget: int
    goals: List[str]

class StrategyResponse(BaseModel):
    id: int
    business_name: str
    budget: int
    strategy: dict
    created_at: str

@app.post("/api/generate-strategy")
def generate_strategy(req: StrategyRequest, db: Session = Depends(database.get_db)):
    # 1. Generate Strategy via AI Generator Fallback
    strategy_json = generate_strategy_content(
        req.business_name, 
        req.industry, 
        req.budget, 
        req.goals
    )
    
    # 2. Save to DB
    db_strategy = models.Strategy(
        business_name=req.business_name,
        industry=req.industry,
        budget=req.budget,
        goals=req.goals,
        strategy_data=strategy_json
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    
    return {
        "id": db_strategy.id,
        "business_name": db_strategy.business_name,
        "budget": db_strategy.budget,
        "strategy": strategy_json,
        "created_at": db_strategy.created_at.isoformat()
    }

@app.get("/api/history")
def get_history(db: Session = Depends(database.get_db)):
    strategies = db.query(models.Strategy).order_by(models.Strategy.id.desc()).limit(50).all()
    results = []
    for s in strategies:
        results.append({
            "id": s.id,
            "business_name": s.business_name,
            "budget": s.budget,
            "date": s.created_at.isoformat(),
            "preview": s.strategy_data.get("core_message", "") if s.strategy_data else ""
        })
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
