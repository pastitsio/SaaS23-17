import io
import matplotlib.pyplot as plt
import numpy as np

from typing import List, Dict, Union


def _scatter_plot(x: Union[List, np.array],
                 y: Union[List, np.array],
                 colors: Union[List, np.array] = None,
                 sizes: Union[List, np.array] = None):
    _, ax = plt.subplots()

    scatter = ax.scatter(x, y, c=colors, s=sizes)

    # produce a legend with the unique colors from the scatter
    legend1 = ax.legend(*scatter.legend_elements(),
                        loc="lower left", title="Classes")
    ax.add_artist(legend1)

    # produce a legend with a cross-section of sizes from the scatter
    handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
    legend2 = ax.legend(handles, labels, loc="upper right", title="Sizes")

    return ax


def _simple_plot(x: Union[List, np.array],
                y: Union[List, np.array],
                x_label: str,
                y_label: str,
                title: str):
    _, ax = plt.subplots()
    ax.plot(x, y)

    ax.set(xlabel=x_label, ylabel=y_label, title=title)
    ax.grid()

    return ax


def _bar_label(x_labels: List[str],
              bar_counts: Dict[str, Union[List, np.array]],
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


def create_chart(json_input: Dict, format: str):
    if json_input['__type__'] == 'simple_plot':
       fn = _simple_plot
    elif json_input['__type__'] == 'bar_label':
       fn = _bar_label
    elif json_input['__type__'] == 'scatter_plot':
       fn = _scatter_plot

    # for k in json_input.keys():
    #     if k.startswith('__'):
    del json_input['__comment__']
    del json_input['__type__']

    ax = fn(**json_input)
    
    img_stream = io.BytesIO()
    ax.figure.savefig(img_stream, format=format)
    img_stream.seek(0)

    return img_stream.getvalue()


# def validate_input(json_input: Dict):
#     i
#         return False
#     return True