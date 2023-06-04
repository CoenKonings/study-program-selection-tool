"""
Author:     Coen Konings
Student nr: 11283394
Date:       June 3rd, 2023

helpers.py:
Contains helper functions needed in other files.
"""

def pawpaw_result_valid(data):
    """
    Validate whether the passed data is a dictionary that represents a valid
    result of the pair-wise comparisons in PAW-PAW. The passed parameter is
    valid if there is a list of N criterium IDs that match criteria in the
    database, and a matrix containing the results of pair-wise comparisons of
    size NxN. All numbers in this matrix should be between 1/9 and 9.
    """
    if "criteria" not in data or "matrix" not in data:
        # Check if data does not contain a criteria or matrix field.
        return False, "Data did not contain matrix or criteria."

    if type(data["criteria"]) is not list or len(data["criteria"]) == 0:
        # Check if criteria is a list with a non-zero length.
        return False, "Criteria is not list or has length 0."

    # TODO check if all criteria IDs are present in database

    if type(data["matrix"]) is not list or len(data["matrix"]) != len(data["criteria"]):
        # Check if matrix is a list of the same length as the criteria list.
        return False, "Matrix is not list or has invalid length."

    if not all(type(i) is list for i in data["matrix"]) or not all(len(i) == len(data["criteria"]) for i in data["matrix"]):
        # Check if all elements of matrix are lists, and if all inner lists
        # are the same size as the outer list.
        return False, "Matrix is not nested list or inner lists have invalid length."

    if not all(all(type(j) is float or type(j) is int for j in i) for i in data["matrix"]):
        # Check if all elements in all inner lists are integers or floats.
        return False, "Not all elements of inner lists of matrix are numbers."

    # TODO check if numbers in matrix are >= than 1/9 and <= 9

    return True, None
