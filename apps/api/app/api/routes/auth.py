import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status
from supabase_auth.errors import (
    AuthApiError,
    AuthError,
    AuthInvalidCredentialsError,
    AuthWeakPasswordError,
)

from app.schemas.auth import LoginRequest, SignUpRequest
from app.services.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)

BLOCKED_EMAIL_DOMAINS = {
    "aol.com",
    "gmail.com",
    "gmx.com",
    "hotmail.com",
    "icloud.com",
    "live.com",
    "me.com",
    "msn.com",
    "outlook.com",
    "proton.me",
    "protonmail.com",
    "yahoo.com",
    "ymail.com",
}


def serialize_user(user: Any) -> dict[str, Any] | None:
    if user is None:
        return None

    return {
        "id": getattr(user, "id", None),
        "email": getattr(user, "email", None),
        "role": getattr(user, "role", None),
        "created_at": getattr(user, "created_at", None),
        "last_sign_in_at": getattr(user, "last_sign_in_at", None),
        "email_confirmed_at": getattr(user, "email_confirmed_at", None),
    }


def serialize_session(session: Any) -> dict[str, Any] | None:
    if session is None:
        return None

    return {
        "access_token": getattr(session, "access_token", None),
        "refresh_token": getattr(session, "refresh_token", None),
        "expires_in": getattr(session, "expires_in", None),
        "expires_at": getattr(session, "expires_at", None),
        "token_type": getattr(session, "token_type", None),
    }


def get_error_message(error: Exception, fallback: str) -> str:
    message = str(error).strip()
    return message or fallback


def uses_personal_email_domain(email: str) -> bool:
    _, _, domain = email.strip().lower().rpartition("@")
    return domain in BLOCKED_EMAIL_DOMAINS


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def sign_up(payload: SignUpRequest) -> dict[str, Any]:
    if uses_personal_email_domain(payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please use your company email address.",
        )

    try:
        response = supabase.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
            }
        )

        user = serialize_user(response.user)
        session = serialize_session(response.session)
        message = (
            "Signup successful. Confirm the email address to finish activating the account."
            if session is None
            else "Signup successful."
        )

        return {
            "success": True,
            "message": message,
            "user": user,
            "session": session,
        }
    except AuthWeakPasswordError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=get_error_message(error, "Password does not meet Supabase requirements."),
        ) from error
    except AuthApiError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=get_error_message(error, "Unable to create account."),
        ) from error
    except AuthError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=get_error_message(error, "Unable to create account."),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected authentication error.",
        ) from error


@router.post("/login")
def login(payload: LoginRequest) -> dict[str, Any]:
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": payload.email,
                "password": payload.password,
            }
        )

        user = serialize_user(response.user)
        session = serialize_session(response.session)

        if user is None or session is None or not session.get("access_token"):
            logger.warning(
                "Incomplete Supabase login response received",
                extra={
                    "email": payload.email,
                    "has_user": user is not None,
                    "has_session": session is not None,
                },
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        return {
            "success": True,
            "message": "Login successful.",
            "user": user,
            "session": session,
        }
    except HTTPException:
        raise
    except AuthInvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_error_message(error, "Invalid email or password."),
        ) from error
    except AuthApiError as error:
        status_code = (
            status.HTTP_401_UNAUTHORIZED
            if getattr(error, "status", None) == 401
            else status.HTTP_400_BAD_REQUEST
        )
        fallback = "Invalid email or password." if status_code == status.HTTP_401_UNAUTHORIZED else "Unable to sign in."
        raise HTTPException(
            status_code=status_code,
            detail=get_error_message(error, fallback),
        ) from error
    except AuthError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=get_error_message(error, "Unable to sign in."),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected authentication error.",
        ) from error
