from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.algorithms.memory.page_replacement import simulate_page_replacement

router = APIRouter(prefix="/memory", tags=["memory"])


class PageReplacementRequest(BaseModel):
    algorithm: str
    reference_string: list[int]
    frames: int


class TranslateRequest(BaseModel):
    virtual_address: int
    page_size: int
    physical_frames: int
    tlb_size: int = 8
    page_table: dict[str, Optional[int]] = {}


@router.post("/page-replacement")
def page_replacement(req: PageReplacementRequest):
    return simulate_page_replacement(req.algorithm, req.reference_string, req.frames)


@router.post("/translate")
def translate_address(req: TranslateRequest):
    va = req.virtual_address
    ps = req.page_size
    page_number = va // ps
    offset = va % ps
    frame = req.page_table.get(str(page_number))
    tlb_hit = False  # simplified: no TLB state server-side
    page_fault = frame is None

    physical_address = frame * ps + offset if frame is not None else None
    return {
        "pageNumber": page_number,
        "offset": offset,
        "frameNumber": frame,
        "physicalAddress": physical_address,
        "tlbHit": tlb_hit,
        "pageFault": page_fault,
    }
