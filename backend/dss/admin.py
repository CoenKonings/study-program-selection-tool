from django.contrib import admin
from .models import *


class StudyProgramAdmin(admin.ModelAdmin):
    list_display = ["name", "id"]


class DecisionTreeAdmin(admin.ModelAdmin):
    list_display = ["name", "id"]


class QuestionAdmin(admin.ModelAdmin):
    list_display = ["text", "id"]


class NodeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id"]


class AnswerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id"]


class CriteriumAdmin(admin.ModelAdmin):
    list_display = ["id", "description"]


class ScoreAdmin(admin.ModelAdmin):
    list_display = ["criterium", "study_program", "value"]


admin.site.register(StudyProgram, StudyProgramAdmin)
admin.site.register(Node, NodeAdmin)
admin.site.register(DecisionTree, DecisionTreeAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Criterium, CriteriumAdmin)
admin.site.register(Score, ScoreAdmin)
