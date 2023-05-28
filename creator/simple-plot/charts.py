import io
from typing import Dict, List, Union

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from config import config

matplotlib.use('Agg')  # non interactive

PLOT_TYPE = config['PLOT']['TYPE']


def fn(x: List,
       y: List,
       x_label: str,
       y_label: str,
       title: str):

    _, ax = plt.subplots()
    ax.plot(x, y)

    ax.set(xlabel=x_label, ylabel=y_label, title=title)
    ax.grid()

    return ax


def create_chart(json_input: Dict, format: str = 'jpeg'):
    plot_type = json_input['__type__']

    if plot_type != PLOT_TYPE:
        raise ValueError(f'__type__ must be {PLOT_TYPE}')

    for k in list(json_input.keys()):
        if k.startswith('__'):
            del json_input[k]

    ax = fn(**json_input)

    img_stream = io.BytesIO()
    ax.figure.savefig(img_stream, format=format)
    img_stream.seek(0)

    return img_stream
