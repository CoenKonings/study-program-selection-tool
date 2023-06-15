"""
Author:         Coen Konings
Student nr:     11283394
Date:           May 29th, 2023

Last edited:    June 3rd, 2023
By:             Coen Konings

views.py:
Contains the models for the decision tree and PAW-PAW.
"""
from django.db import models


class StudyProgram(models.Model):
    """
    A study program is (part of) the outcome of a decision making method.
    """

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Criterium(models.Model):
    """
    A criterium to be used in the PAW-PAW decision making method.
    """

    description = models.CharField(max_length=255)
    short_description = models.CharField(max_length=64)

    def __str__(self):
        return "Criterium {}: {}".format(self.id, self.description)


class Score(models.Model):
    """
    Each StudyProgram has a Score on each Criterium.
    """

    criterium = models.ForeignKey(Criterium, on_delete=models.CASCADE)
    study_program = models.ForeignKey(StudyProgram, on_delete=models.CASCADE)
    value = models.FloatField()

    class Meta:
        unique_together = (
            "criterium",
            "study_program",
        )


class Question(models.Model):
    """
    The model for a question. Each question is linked to a Node and can have
    multiple Answers.
    """

    text = models.CharField(max_length=255)

    def __str__(self):
        return "Question {}: {}".format(self.id, self.text)


class Node(models.Model):
    """
    The model for a node in a decision tree. Each node leads to either a
    Question or a StudyProgram (result). If it leads to a Question, this node
    has children and result should be null. A node without a question should be
    a leaf, and as such should lead to a StudyProgram.
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


class Answer(models.Model):
    """
    A response to a question. Each Answer leads to the next node in the
    decision tree.
    """

    text = models.CharField(max_length=255)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    leads_to = models.ForeignKey(Node, on_delete=models.CASCADE)

    def __str__(self):
        return '"{}" as answer to "{}", leading to "{}".'.format(
            self.text, self.question, self.leads_to
        )
