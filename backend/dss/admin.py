from django.contrib import admin
from .models import *


class StudyProgramAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


admin.site.register(StudyProgram, StudyProgramAdmin)
