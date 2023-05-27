from collections import namedtuple
from typing import Dict, List, Union

from config import config

PLOT_TYPES = config["PLOT"]["TYPES"].split(",")

fields = ("is_type", "ndim")
defaults = (None, 0)
label = namedtuple("label", fields, defaults=defaults)


def _type_name(name):
    try:
        label_type = name._name
    except AttributeError:
        label_type = str(name).split(" ")[1][1:-2]

    return label_type


def _validate(json_input, valid_input, matching_pairs):
    # check: all keys are present
    for key in json_input.keys():
        if key not in valid_input.keys():
            keys_list = sorted(valid_input.keys())
            raise KeyError(f"Key [{key}] should be one of: {keys_list}")

        '''
        check: type is valid for every dimension
        if x = [[2, 3], [3, 4], [5, 'kostas']]


        '''
        valid_key = valid_input[key]
        dim_check = [json_input[key]]
        for dim in range(valid_key.ndim + 1):
            content_type = valid_key.is_type[dim]
            if not all(isinstance(element, content_type) for element in dim_check):
                raise TypeError(
                    f"Dimension [{dim}] of key [{key}] should be of type: {_type_name(content_type)}"
                )
            dim_check = dim_check[0]

        # check: axis mismatch
        for pair in matching_pairs:
            len1 = len(json_input[pair[0]])
            len2 = len(json_input[pair[1]])
            if len1 != len2:
                raise ValueError(
                    f"[Size of {pair[0]}: {len1}] must equal [Size of y: {len2}]"
                )


def validate_json_input(json_input: Dict):
    plot_type = json_input["__type__"]
    if not (plot_type in PLOT_TYPES):
        raise ValueError(f"__type__ must be one of {PLOT_TYPES}")

    for k in list(json_input.keys()):
        if k.startswith("__"):
            del json_input[k]

    if plot_type == "bar_label_plot":
        pass
        # valid_input = {
        #     'x_labels': List[str],
        #     'bar_counts': Dict[str, List[Union[int, float]]],
        #     'title': str}

    if plot_type == "scatter_plot":
        pass

    if plot_type == "simple_plot":
        valid_input = {
            "x": label(is_type=[List, (int, float)], ndim=1),
            "y": label(is_type=[List, (int, float)], ndim=1),
            "x_label": label(is_type=[str,]),
            "y_label": label(is_type=[str,]),
            "title": label(is_type=[str,]),
        }

        matching_pairs = (['x', 'y'],)

    _validate(json_input, valid_input, matching_pairs)