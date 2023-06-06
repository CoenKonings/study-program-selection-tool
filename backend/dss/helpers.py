"""
Author:     Coen Konings
Student nr: 11283394
Date:       June 3rd, 2023

helpers.py:
Contains helper functions needed in other files.
"""
from django.db.models import Case, When
from rest_framework.response import Response
from rest_framework import status
from .models import Criterium, StudyProgram
from .serializers import StudyProgramSerializer
import numpy as np


def pawpaw_result_validate_data_types(data):
    """
    Validate whether the passed data is a dictionary that represents a valid
    result of the pair-wise comparisons in PAW-PAW. The passed parameter is
    valid if there is a list of N criterium IDs and a matrix containing the
    results of pair-wise comparisons of size NxN. All numbers in this matrix
    should be between 1/9 and 9.

    @param data:    The data from the incoming POST request.
    @returns:       A tuple of True and None if the data types and structures
                    in data form a valid result of pair-wise comparisons, a
                    tuple of False and an error message otherwise.
    """
    if "criteria" not in data or "matrix" not in data:
        # Check if data does not contain a criteria or matrix field.
        return False, "Data did not contain matrix or criteria."

    if type(data["criteria"]) is not list or len(data["criteria"]) == 0:
        # Check if criteria is a list with a non-zero length.
        return False, "Criteria is not list or has length 0."

    if type(data["matrix"]) is not list or len(data["matrix"]) != len(data["criteria"]):
        # Check if matrix is a list of the same length as the criteria list.
        return False, "Matrix is not list or has invalid length."

    if not all(type(i) is list for i in data["matrix"]) or not all(
        len(i) == len(data["criteria"]) for i in data["matrix"]
    ):
        # Check if all elements of matrix are lists, and if all inner lists
        # are the same size as the outer list.
        return False, "Matrix is not nested list or inner lists have invalid length."

    if not all(
        all(type(j) is float or type(j) is int for j in i) for i in data["matrix"]
    ):
        # Check if all elements in all inner lists are integers or floats.
        return False, "Not all elements of inner lists of matrix are numbers."

    if not all(all(j > 0.1 and j <= 9 for j in i) for i in data["matrix"]):
        # Check if all numbers in matrix are >= 1/9 and <= 9.
        # To prevent unwanted rounding errors, >= 1/9 is replaced by > 0.1.
        return False, "Not all elements in matrix are between 1/9 and 9."

    return True, None


def weighted_sum_method(weights, criteria):
    """
    Create a ranking of study programs by performing the weighted sum method
    with the given criteria and weights.

    @param weights:     The weights of the criteria. Should be in the same
                        order as the criteria.
    @param criteria:    The criteria.
    @returns:           A ranking of study programs with their corresponding
                        weighted score.
    """
    study_programs = StudyProgram.objects.all()
    scores = [{"study_program": study_program, "score": 0} for study_program in study_programs]

    for index, weight in enumerate(weights):
        criterium = criteria[index]

        for score in scores:
            score["score"] += weight * score["study_program"].score_set.get(criterium=criterium).value

    return scores


def pawpaw(data):
    """
    TODO refactor
    Perform the calculations for PAW-PAW to generate a ranking.

    @param data:    The result of pair-wise comparisons.
    @returns:       The HTTP response that the view should return.
    """
    # Retrieve all criteria from the database in the correct order.
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(data["criteria"])])
    criteria = Criterium.objects.filter(pk__in=data["criteria"]).order_by(preserved)

    if len(criteria) != len(data["criteria"]):
        # Check if all IDs exist and are unique.
        return False, "Not all IDs are valid and unique."

    matrix_a = np.array(data["matrix"])
    # Calculate eigenvalues and eigenvectors of the comparison matrix.
    eigenvalues, eigenvectors = np.linalg.eig(matrix_a)
    # Find the largest eigenvalue and its corresponding eigenvector. Since all
    # entries in the matrix are real and positive, the eigenvalues are positive
    # too. Thus, the complex parts can be disregarded.
    index = np.argmax(eigenvalues)
    max_eigenvalue = np.real(eigenvalues[index])
    weights = np.real(eigenvectors[:, index])
    # Normalize the eigenvector so that its entries sum to 1.
    weights /= weights.sum()

    ranking = weighted_sum_method(weights, criteria)
    consistency = np.abs(max_eigenvalue - len(data["criteria"])) <= 1

    return True, {"ranking": ranking, "consistency": consistency}
