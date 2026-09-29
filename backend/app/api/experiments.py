import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.experiment import Experiment

router = APIRouter(prefix="/experiments", tags=["experiments"])


class ExperimentCreate(BaseModel):
    name: str
    module: str
    algorithm: str
    config: Optional[dict] = None
    workload: Optional[dict] = None
    metrics: Optional[dict] = None
    event_log: Optional[list] = None


class ExperimentResponse(BaseModel):
    id: str
    name: str
    module: str
    algorithm: str
    createdAt: str
    config: Optional[dict] = None
    workload: Optional[dict] = None
    metrics: Optional[dict] = None

    class Config:
        from_attributes = True


def _to_response(exp: Experiment) -> dict:
    return {
        "id": exp.id,
        "name": exp.name,
        "module": exp.module,
        "algorithm": exp.algorithm,
        "createdAt": exp.created_at.isoformat() if exp.created_at else "",
        "config": json.loads(exp.config) if exp.config else None,
        "workload": json.loads(exp.workload) if exp.workload else None,
        "metrics": json.loads(exp.metrics) if exp.metrics else None,
    }


@router.get("")
def list_experiments(db: Session = Depends(get_db)):
    exps = db.query(Experiment).order_by(Experiment.created_at.desc()).all()
    return [_to_response(e) for e in exps]


@router.post("")
def create_experiment(body: ExperimentCreate, db: Session = Depends(get_db)):
    exp = Experiment(
        id=str(uuid.uuid4()),
        name=body.name,
        module=body.module,
        algorithm=body.algorithm,
        created_at=datetime.utcnow(),
        config=json.dumps(body.config) if body.config else None,
        workload=json.dumps(body.workload) if body.workload else None,
        metrics=json.dumps(body.metrics) if body.metrics else None,
        event_log=json.dumps(body.event_log) if body.event_log else None,
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return _to_response(exp)


@router.get("/{exp_id}")
def get_experiment(exp_id: str, db: Session = Depends(get_db)):
    exp = db.query(Experiment).filter(Experiment.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return _to_response(exp)


@router.delete("/{exp_id}")
def delete_experiment(exp_id: str, db: Session = Depends(get_db)):
    exp = db.query(Experiment).filter(Experiment.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    db.delete(exp)
    db.commit()
    return {"deleted": True}


@router.post("/{exp_id}/duplicate")
def duplicate_experiment(exp_id: str, db: Session = Depends(get_db)):
    exp = db.query(Experiment).filter(Experiment.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    copy = Experiment(
        id=str(uuid.uuid4()),
        name=f"{exp.name} (copy)",
        module=exp.module,
        algorithm=exp.algorithm,
        created_at=datetime.utcnow(),
        config=exp.config,
        workload=exp.workload,
        metrics=exp.metrics,
        event_log=exp.event_log,
    )
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return _to_response(copy)
