import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from app.database.db import Base


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    module = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    config = Column(Text, nullable=True)      # JSON
    workload = Column(Text, nullable=True)    # JSON
    metrics = Column(Text, nullable=True)     # JSON
    event_log = Column(Text, nullable=True)   # JSON
