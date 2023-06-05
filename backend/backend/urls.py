"""
Author:         Coen Konings
Student nr:     11283394
Date:           May 29th, 2023

Last edited:    June 3rd, 2023
By:             Coen Konings

urls.py:
Contains the router and URL patterns needed for the API to work.
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from dss import views


router = routers.DefaultRouter()
router.register(r"decision-trees", views.DecisionTreeViewSet)
router.register(r"study-programs", views.StudyProgramViewSet)
router.register(r"nodes", views.NodeViewSet)
router.register(r"criteria", views.CriteriumViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("pawpaw-result/", views.CriteriaWeightView.as_view()),
]
