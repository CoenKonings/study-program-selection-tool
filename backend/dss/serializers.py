from .models import *
from rest_framework import serializers


class DecisionTreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DecisionTree
        fields = ["name", "root"]


class StudyProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyProgram
        fields = ["id", "name"]


class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ["id", "question", "result"]
        depth = 1


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "leads_to"]


class CriteriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterium
        fields = ["id", "description"]
