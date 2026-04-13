import os
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse, PlainTextResponse

from app.cipher.report import compare
from app.routes._helpers import read_file, get_name


router = APIRouter()


@router.get("/favicon.ico", include_in_schema=False)
async def favicon():
    path = os.path.join(os.path.dirname(__file__), "..", "static", "favicon.ico")
    return FileResponse(path)


@router.post("/report")
async def report_route(
    original: UploadFile = File(...),
    recovered: UploadFile = File(...),
):
    original_text = await read_file(original)
    recovered_text = await read_file(recovered)
    report = compare(original_text, recovered_text)

    name = get_name(original)
    recovered_name = (recovered.filename or "").upper()
    algo_suffixes = ["_CC_", "_PC_", "_VC_", "_PFC_", "_HC_", "_DC_", "_AES_", "_RC5_"]
    suffix = next((s.strip("_") for s in algo_suffixes if s in recovered_name), "")
    report_name = f"{name}_{suffix}_Report.txt" if suffix else f"{name}_Report.txt"
    return PlainTextResponse(
        content=report,
        headers={
            "Content-Disposition": f'attachment; filename="{report_name}"'
        },
    )
