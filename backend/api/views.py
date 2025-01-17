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
 
@csrf_exempt
def text_query_view(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            user_text = data.get("text", "")
            user_id = data.get("userId", "")

            # Call the text_query function with the user's text and ID
            result_query = text_query(user_text, user_id)
            # print(result_query)

            if result_query:
                # Extracting relevant data from the DetectIntentResponse object
                query_result = result_query.query_result  # Get the query_result from the response
                # print(type(query_result))

                intent_name = query_result.intent.display_name if query_result.intent else ""
    
                # Extract user query
                user_query = query_result.query_text if query_result.query_text else ""
                
                # Extract fulfillment text
                fulfillment_text = query_result.fulfillment_text if query_result.fulfillment_text else ""
                
                # Initialize parameters
                parameters = {}
                
                # Loop through output contexts to find 'createnote-followup'
                for context in query_result.output_contexts:
                    if "createnote-followup" in context.name:
                        #parameters = context.parameters  # Directly access parameters
                        parameters = {key: context.parameters[key] for key in context.parameters if key in ["Title", "Content"]}
                        break
                    elif "deletenote-followup" in context.name:
                        # Extract parameters for "deletenote-followup"
                        parameters = {key: context.parameters[key] for key in context.parameters if key in ["Title"]}
                        break
                
                res_obj = {
                    
                        "intent_name": intent_name,
                        "user_query": user_query,
                        "fulfillment_text": fulfillment_text,
                        "parameters": {key: parameters[key] for key in parameters}
                    
                }

            else:
                res_obj = {"error": "No response from Dialogflow"}

            # Return the response as a JSON response
            return JsonResponse(res_obj)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    # If the request method is not POST
    return JsonResponse({"message": "Invalid request method"}, status=405)