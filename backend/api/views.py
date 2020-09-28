from rest_framework import viewsets, permissions

from .serializers import TaskSerializer
from .models import Task


class TaskViewset(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = TaskSerializer
