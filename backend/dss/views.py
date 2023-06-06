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
from .helpers import pawpaw_result_validate_data_types, pawpaw


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

    @action(detail=True, methods=["get"])
    def responses(self, request, pk=None):
        """
        Action on a Node detail view. Retrieves all possible responses to this
        Node's question.
        """
        answers = self.get_object().question.answer_set
        serializer = AnswerSerializer(answers, many=True)

        return Response(serializer.data)


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


class CriteriaWeightView(APIView):
    """
    API endpoint that allows posting the results of pair-wise comparisons, and
    returns a ranking of StudyPrograms.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        valid, error = pawpaw_result_validate_data_types(data)

        if valid:
            success, result = pawpaw(data)

            if not success:
                return Response({"detail": result}, status.HTTP_400_BAD_REQUEST)

            # Serialize the study programs to be able to send them.
            for item in result["ranking"]:
                serializer = StudyProgramSerializer(item["study_program"])
                item["study_program"] = serializer.data
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)
