"""
Author:         Coen Konings
Student nr:     11283394
Date:           May 29th, 2023

Last edited:    June 3rd, 2023
By:             Coen Konings

views.py:
Contains the serializers needed to convert database entries into JSON for use
in the API.
"""

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


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "leads_to"]


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "answer_set"]


class NodeSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    result = StudyProgramSerializer(read_only=True)

    class Meta:
        model = Node
        fields = ["id", "question", "result"]


class CriteriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterium
        fields = ["id", "description"]
