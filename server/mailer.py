import html
import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

from schemas import SupportRequest

load_dotenv()

SHOP_NAME = "GLOW BEAM"
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.hostinger.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))


def send_support_email(payload: SupportRequest) -> None:
    sender_email = os.getenv("PROF_GMAIL")
    sender_password = os.getenv("PROF_PASSWORD")
    if not sender_email or not sender_password:
        print("[mail] Missing PROF_GMAIL or PROF_PASSWORD environment variables.")
        return

    # Raw values for the subject and plain text
    order_raw = payload.orderNumber or "N/A"
    phone_raw = payload.phone or "N/A"

    # Escaped values for the HTML part only
    name = html.escape(payload.name)
    email = html.escape(payload.email)
    order_num = html.escape(order_raw)
    phone = html.escape(phone_raw)
    comment = html.escape(payload.comment).replace("\n", "<br>")

    html_content = f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#27233a;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:22px;color:#c4547e;">New Support Request</h2>
      <p style="margin:0 0 12px;">You have received a new message from the contact form.</p>

      <table role="presentation" cellpadding="8" cellspacing="0" border="1" style="width:100%; border-collapse: collapse; border-color: #ebd3da; margin-bottom: 20px;">
        <tr>
          <td style="background-color:#fdf8f9; width:120px;"><strong>Name:</strong></td>
          <td>{name}</td>
        </tr>
        <tr>
          <td style="background-color:#fdf8f9;"><strong>Email:</strong></td>
          <td><a href="mailto:{email}">{email}</a></td>
        </tr>
        <tr>
          <td style="background-color:#fdf8f9;"><strong>Order Number:</strong></td>
          <td>{order_num}</td>
        </tr>
        <tr>
          <td style="background-color:#fdf8f9;"><strong>Phone:</strong></td>
          <td>{phone}</td>
        </tr>
      </table>

      <h3 style="margin:0 0 12px;font-size:17px;">Message:</h3>
      <div style="background-color:#f9f9f9; padding: 16px; border-left: 4px solid #c4547e; border-radius: 4px;">
        {comment}
      </div>

      <p style="margin:24px 0 0;font-size:14px;color:#6f6a82;">
        Reply directly to this email to respond to {name}.
      </p>
    </div>
    """

    text_content = (
        "New Support Request\n"
        "-------------------\n"
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Order Number: {order_raw}\n"
        f"Phone: {phone_raw}\n\n"
        "Message:\n"
        f"{payload.comment}\n"
    )

    msg = EmailMessage()
    msg["Subject"] = f"Support Request: {payload.name} - {order_raw}"
    msg["From"] = f'"{SHOP_NAME}" <{sender_email}>'
    msg["To"] = sender_email  # sends to yourself
    msg["Reply-To"] = payload.email  # reply goes straight to the customer
    msg.set_content(text_content)
    msg.add_alternative(html_content, subtype="html")

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"[mail] Support email sent for {payload.email}")
    except Exception as e:
        print(f"[mail] FAILED to send email: {e}")
