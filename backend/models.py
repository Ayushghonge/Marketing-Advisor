from sqlalchemy import Column, Integer, String, JSON, DateTime
from database import Base
import datetime

class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, index=True)
    industry = Column(String)
    budget = Column(Integer)
    goals = Column(JSON)
    target_audience = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    strategy_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
