from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    # path('dialogflow-webhook/', views.dialogflow_webhook, name='dialogflow-webhook'),
    path('text_query/', views.text_query_view, name='text_query')
]
