import re
from typing import AnyStr, Dict, List

from config import config

PLOT_TYPES = config['PLOT']['TYPES'].split(',')


def validate_json_input(json_input: Dict):
    plot_type = json_input['__type__']
    if not (plot_type in PLOT_TYPES):
        raise ValueError(f'__type__ must be one of {PLOT_TYPES}')

    for k in list(json_input.keys()):
        if k.startswith('__'):
            del json_input[k]


    if plot_type == 'bar_label_plot':
        valid_input = {
            'x_labels': List[str],
            'bar_counts': Dict[str, List],
            'title': str}

        for key in json_input.keys():
            if key not in valid_input.keys():
                raise KeyError(
                    f'Key [key] should be in {sorted(valid_input.keys())}')

        print(json_input['x_labels'])

    if plot_type == 'scatter_plot':
        pass

    if plot_type == 'simple_plot':
        valid_input = {
            'x': List,
            'y': List,
            'x_label': str,
            'y_label': str,
            'title': str
        }

        for key in json_input.keys():
            # check all keys are present
            if key not in valid_input.keys():
                keys_list = sorted(valid_input.keys())
                raise KeyError(f'Key [{key}] should be one of: {keys_list}')
            
            # check type is valid
            if not isinstance(json_input[key], valid_input[key]):
                try:
                    be_of_type = valid_input[key]._name
                except AttributeError:
                    be_of_type = str(valid_input[key]).split(' ')[1][1:-2]

                raise TypeError(f'Key [{key}] should be of type: {be_of_type}')
            
        # check axis mismatch 
        if len(json_input['x']) != len(json_input['y']):
            raise ValueError(f"[Size of x: {len(json_input['x'])}] must equal [Size of y: {len(json_input['y'])}]")


