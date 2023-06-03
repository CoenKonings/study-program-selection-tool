"""
Author:     Coen Konings
Student nr: 11283394
Date:       June 3rd, 2023

helpers.py:
Contains helper functions needed in other files.
"""

def pawpaw_result_valid(data):

    if "criteria" not in data or "matrix" not in data:
        return False

    if type(data["criteria"]) is not list or len(data["criteria"]) <= 0:
        return False

    return True
