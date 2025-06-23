from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import Note
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .chatbot import text_query
from datetime import datetime, date
from decimal import Decimal
# from google.protobuf.json_format import MessageToDict


 
# Existing classes for Notes
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
 
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
 
 
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
 
 
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
 
# @csrf_exempt
# def text_query_view(request):
#     if request.method == "POST":
#         try:
#             # Parse the incoming JSON data
#             data = json.loads(request.body)
#             user_text = data.get("text", "")
#             user_id = data.get("userId", "")

#             # Call the text_query function with the user's text and ID
#             result_query = text_query(user_text, user_id)
#             print(result_query)

#             if result_query:
#                 # Extract relevant data from the DetectIntentResponse object
#                 query_result = result_query.query_result  # Get the query_result from the response

#                 intent_name = query_result.intent.display_name if query_result.intent else ""
#                 user_query = query_result.query_text if query_result.query_text else ""
#                 fulfillment_text = query_result.fulfillment_text if query_result.fulfillment_text else ""

#                 # Extract and serialize the custom payload
#                 custom_payload = None

#                 # Iterate through fulfillment messages and check for payload
#                 for message in query_result.fulfillment_messages:
#                     payload_exist = getattr(message, 'payload', None)
#                     if payload_exist:
#                         custom_payload = convert_to_serializable(payload_exist)
#                         break  # Stop at the first occurrence of a payload


#                 # Initialize parameters
#                 parameters = {}

#                 # Loop through output contexts to find 'createnote-followup' and 'deletenote-followup'
#                 followup_contexts = [ctx for ctx in query_result.output_contexts if 'followup' in ctx.name]
#                 for context in followup_contexts:
#                     if "createnote-followup" in context.name:
#                         parameters = {key: context.parameters[key] for key in ["Title", "Content"] if key in context.parameters} or None
#                     elif "deletenote-followup" in context.name:
#                         parameters = {key: context.parameters[key] for key in ["Title"] if key in context.parameters} or None

#                 # Prepare the response object
#                 res_obj = {
#                     "intent_name": intent_name,
#                     "user_query": user_query,
#                     "fulfillment_text": fulfillment_text,
#                     "parameters": parameters,  # Include parameters
#                     "custom_payload": custom_payload,  # Include serialized custom payload
#                 }

#             else:
#                 res_obj = {"error": "No response from Dialogflow"}

#             # Return the response as a JSON response
#             return JsonResponse(res_obj)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     # If the request method is not POST
#     return JsonResponse({"message": "Invalid request method"}, status=405)


# def convert_to_serializable(obj):
#     """
#     Recursively convert non-serializable objects (e.g., MapComposite, RepeatedComposite) into JSON-serializable types.
#     """
#     if obj is None:
#         return None
#     elif isinstance(obj, (str, int, float, bool)):
#         return obj
#     elif isinstance(obj, (datetime, date)):
#         return obj.isoformat()
#     elif isinstance(obj, Decimal):
#         return float(obj)
#     elif hasattr(obj, 'items'):  # Handle MapComposite-like objects
#         return {key: convert_to_serializable(value) for key, value in obj.items()}
#     elif hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes)):  # Handle RepeatedComposite-like objects
#         return [convert_to_serializable(item) for item in obj]
#     elif hasattr(obj, 'ListFields'):  # Handle Protocol Buffer Message objects
#         return {field.name: convert_to_serializable(getattr(obj, field.name)) for field in obj.ListFields()}
#     else:
#         try:
#             return str(obj)  # Fallback to string representation
#         except Exception as e:
#             return f"Unserializable object: {str(e)}" 

@csrf_exempt
def text_query_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_text = data.get("text", "")
            user_id = data.get("userId", "")

            result_query = text_query(user_text, user_id)
            print(result_query)

            if result_query:
                query_result = result_query.query_result

                intent_name = query_result.intent.display_name if query_result.intent else ""
                user_query = query_result.query_text or ""
                fulfillment_text = query_result.fulfillment_text or ""

                custom_payload = None
                for message in query_result.fulfillment_messages:
                    if getattr(message, 'payload', None):
                        custom_payload = convert_to_serializable(message.payload)
                        break

                res_obj = {
                    "intent_name": intent_name,
                    "user_query": user_query,
                    "fulfillment_text": fulfillment_text,
                    "parameters": None,  # Now explicitly set to None
                    "custom_payload": custom_payload,
                }
            else:
                res_obj = {"error": "No response from Dialogflow"}

            return JsonResponse(res_obj)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"message": "Invalid request method"}, status=405)


def convert_to_serializable(obj):
    if obj is None:
        return None
    elif isinstance(obj, (str, int, float, bool)):
        return obj
    elif isinstance(obj, (datetime, date)):
        return obj.isoformat()
    elif isinstance(obj, Decimal):
        return float(obj)
    elif hasattr(obj, 'items'):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes)):
        return [convert_to_serializable(item) for item in obj]
    elif hasattr(obj, 'ListFields'):
        return {field.name: convert_to_serializable(getattr(obj, field.name)) for field in obj.ListFields()}
    else:
        try:
            return str(obj)
        except Exception as e:
            return f"Unserializable object: {str(e)}"
