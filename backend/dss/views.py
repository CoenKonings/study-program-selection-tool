from .models import *
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import *


class DecisionTreeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows DecisionTrees to be viewed.
    """

    queryset = DecisionTree.objects.all().order_by("id")
    serializer_class = DecisionTreeSerializer
    permission_classes = []


class NodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows Nodes to be viewed.
    """

    queryset = Node.objects.all().order_by("id")
    serializer_class = NodeSerializer
    permission_classes = []

    @action(detail=True, methods=['get'])
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
    permission_classes = []
