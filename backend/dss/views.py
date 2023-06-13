"""
Author:         Coen Konings
Student nr:     11283394
Date:           May 29th, 2023

Last edited:    June 3rd, 2023
By:             Coen Konings

views.py:
Contains the views needed to make the DSS work.
"""
from .models import *
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from .helpers import pawpaw_result_validate_data_types, pawpaw, validate_conversation
import openai
import os
from .prompt import GPT_PROMPT


class DecisionTreeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows DecisionTrees to be viewed.
    """

    queryset = DecisionTree.objects.all().order_by("id")
    serializer_class = DecisionTreeSerializer
    permission_classes = [permissions.AllowAny]


class NodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows Nodes to be viewed.
    """

    queryset = Node.objects.all().order_by("id")
    serializer_class = NodeSerializer
    permission_classes = [permissions.AllowAny]

    # @action(detail=True, methods=["get"])
    # def answers(self, request, pk=None):
    #     """
    #     Action on a Node detail view. Retrieves all possible responses to this
    #     Node's question.
    #     """
    #     answers = self.get_object().question.answer_set
    #     answerSerializer = AnswerSerializer(answers, many=True)


class StudyProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows StudyPrograms to be viewed.
    """

    queryset = StudyProgram.objects.all().order_by("name")
    serializer_class = DecisionTreeSerializer
    permission_classes = [permissions.AllowAny]


class CriteriumViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows Criteria to be viewed.
    """

    queryset = Criterium.objects.all()
    serializer_class = CriteriumSerializer
    permission_classes = [permissions.AllowAny]


class PawPawResultView(APIView):
    """
    API endpoint that allows posting the results of pair-wise comparisons, and
    returns a ranking of StudyPrograms.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        valid, error = pawpaw_result_validate_data_types(data)

        if not valid:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        success, result = pawpaw(data)

        if not success:
            return Response({"detail": result}, status.HTTP_400_BAD_REQUEST)

        # Serialize the study programs to be able to send them.
        for item in result["ranking"]:
            serializer = StudyProgramSerializer(item["study_program"])
            item["study_program"] = serializer.data
        return Response(result, status=status.HTTP_200_OK)


class ConversationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        messages = request.data
        valid, error = validate_conversation(messages)
        if not valid:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        messages.insert(0, {
            "role": "system",
            "content": GPT_PROMPT
        })
        openai.api_key = os.environ["GPT_API_KEY"]
        openai.organization = "org-wXX30QVS20bb2WaHK3Yr2vqA"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        msg = response["choices"][0]['message']['content']
        return Response(msg, status=status.HTTP_200_OK)
