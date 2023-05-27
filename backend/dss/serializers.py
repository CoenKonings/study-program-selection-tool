from .models import StudyProgram
from rest_framework import serializers


class StudyProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyProgram
        fields = ["id", "name"]
        read_only_fields = ["name"]
