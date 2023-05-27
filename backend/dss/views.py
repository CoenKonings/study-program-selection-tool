from .models import StudyProgram
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import StudyProgramSerializer


class StudyProgramViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StudyPrograms to be viewed.
    """

    queryset = StudyProgram.objects.all().order_by("name")
    serializer_class = StudyProgramSerializer
    permission_classes = []
    http_method_names = ["get"]
