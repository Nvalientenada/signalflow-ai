from dotenv import load_dotenv
import os


load_dotenv() # loads variables from local .env file


def get_boolean_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)

    if value is None:
        return default

    return value.lower() in ["true", "1", "yes", "on"]


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
USE_LLM_ANALYSIS = get_boolean_env("USE_LLM_ANALYSIS", False)