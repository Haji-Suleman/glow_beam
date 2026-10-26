from fastapi import APIRouter, BackgroundTasks
from schemas import SupportRequest
from mailer import send_support_email  # Import the function we just made

router = APIRouter(prefix="/support", tags=["Support"])


@router.post("")
def support_request(payload: SupportRequest, background_tasks: BackgroundTasks):
    print(f"Received support request: {payload.model_dump()}")

    # Add the email sending to background tasks
    background_tasks.add_task(send_support_email, payload)

    return {
        "ok": "success",
        "message": "Support request received",
        "data": payload.model_dump(),
    }
2