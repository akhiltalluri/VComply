"""Law catalog access — file/DB backed implementations go here."""


def list_laws_preview() -> list[dict]:
    """Minimal stub so GET /laws returns structured JSON for the UI."""
    return [
        {
            "id": "nyc-ll-144",
            "name": "NYC Local Law 144",
            "jurisdiction": "New York City",
            "summary": "Automated employment decision tools — bias audit and notice requirements.",
        }
    ]
