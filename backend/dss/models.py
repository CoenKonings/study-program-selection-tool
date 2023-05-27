from django.db import models


class StudyProgram(models.Model):
    """
    A study program is (part of) the outcome of a decision making method.
    """

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Question(models.Model):
    """
    The question linked to a node of the decision tree. Each question can have
    multiple associated responses, and each response leads to one of the next
    nodes.
    """

    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Node(models.Model):
    """
    The model for a node in a decision tree. Each node leads to either a
    Question or a StudyProgram (result). If it leads to a Question, this node has children and
    result should be null. A node without a question should be a leaf, and as
    such should lead to a StudyProgram.
    """

    question = models.ForeignKey(
        Question, on_delete=models.SET_NULL, null=True, blank=True
    )
    result = models.ForeignKey(
        StudyProgram, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        s = "Node {}. ".format(self.id)
        if self.question:
            return s + "Inner node, question: {}".format(self.question)
        else:
            return s + "Leaf, result: {}".format(self.result)


class DecisionTree(models.Model):
    """
    Points to the root node of a decision tree.
    """

    name = models.CharField(max_length=255)
    root = models.ForeignKey(Node, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return "Decision tree: {}.".format(self.name)


class Response(models.Model):
    """
    The response to a question. Each response leads to the next node in the
    decision tree.
    """

    text = models.CharField(max_length=255)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    leads_to = models.ForeignKey(Node, on_delete=models.CASCADE)

    def __str__(self):
        return "\"{}\" as response to \"{}\", leading to \"{}\".".format(
            self.text, self.question, self.leads_to
        )
