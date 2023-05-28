import io
from typing import Dict, List, Union

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from config import config

matplotlib.use('Agg')  # non interactive

PLOT_TYPE = config['PLOT']['TYPE']


def fn(x_labels: List[str],
       bar_counts: Dict[str, List],
       title: str):
    width = 0.6  # the width of the bars: can also be len(x) sequence

    _, ax = plt.subplots()
    bottom = np.zeros(len(x_labels))

    for label, label_count in bar_counts.items():
        p = ax.bar(x_labels, label_count, width, label=label, bottom=bottom)
        bottom += label_count

        ax.bar_label(p, label_type='center')

    ax.set_title(title)
    ax.legend()

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
