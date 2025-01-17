# from google.cloud import dialogflow_v2 as dialogflow
# from .devkey import googleProjectId, googlePrivateKey, googleClientEmail, dialogFlowSessionID, dialogFlowSessionLanguageCode

# credentials = {
#     "client_email": googleClientEmail,
#     "private_key": googlePrivateKey,
# }
# session_client = dialogflow.SessionsClient(credentials=credentials)
# project_id = googleProjectId

# def text_query(user_text, user_id):
#     session_path = session_client.session_path(project_id, f"{dialogFlowSessionID}-{user_id}")
#     request = {
#         "session": session_path,
#         "query_input": {
#             "text": {
#                 "text": user_text,
#                 "language_code": dialogFlowSessionLanguageCode,
#             }
#         },
#         # "timeout": 10.0
#     }
#     try:
#         print(f"Requesting Dialogflow with queryInput: {request}")
#         response = session_client.detect_intent(request=request)
#         print(f"Response: {response}")
#         return response
#     except Exception as e:
#         print(f"Error: {e}")
#         return None

import uuid
from google.cloud import dialogflow_v2 as dialogflow
from google.oauth2.service_account import Credentials
from .devkey import (
    googleProjectId,
    googlePrivateKey,
    googleClientEmail,
    dialogFlowSessionID,
    dialogFlowSessionLanguageCode,
)

# Create the credentials object
credentials = Credentials.from_service_account_info(
    {
        "type": "service_account",
        "project_id": googleProjectId,
        "private_key_id": "not_needed_in_code",  # Placeholder for security
        "private_key": googlePrivateKey.replace("\\n", "\n"),
        "client_email": googleClientEmail,
        "client_id": "not_needed_in_code",  # Placeholder for security
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/"
        + googleClientEmail,
    }
)

# Initialize the Dialogflow session client
session_client = dialogflow.SessionsClient(credentials=credentials)
project_id = googleProjectId


def text_query(user_text, user_id):
    """
    Sends a text query to Dialogflow and returns the response.
    """
    unique_session_id = f"{dialogFlowSessionID}-{user_id}"
    
    # Create the session path
    session_path = session_client.session_path(project_id, unique_session_id)

    # Build the query input
    query_input = dialogflow.QueryInput(
        text=dialogflow.TextInput(
            text=user_text,
            language_code=dialogFlowSessionLanguageCode,
        )
    )

    try:
        # print(f"Requesting Dialogflow with session: {session_path} and queryInput: {query_input}")

        # Send the request to Dialogflow
        response = session_client.detect_intent(
            session=session_path,
            query_input=query_input,
            timeout=60.0  # Setting a timeout to avoid indefinite waits
        )
        # print(type(response))
        # print()
        # print(f"Response: {response}")
        return response
    except Exception as e:
        print(f"Error: {e}")
        return None
