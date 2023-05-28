import io
from typing import Dict, List, Union

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from config import config

matplotlib.use("Agg")  # non interactive

PLOT_TYPE = config["PLOT"]["TYPE"]


def fn(x: List, y: List, colors: List = None, sizes: List = None):

    _, ax = plt.subplots()

    scatter = ax.scatter(x, y, c=colors, s=sizes)

    # produce a legend with the unique colors from the scatter
    legend1 = ax.legend(*scatter.legend_elements(), loc="best", title="Classes")
    ax.add_artist(legend1)

    # produce a legend with a cross-section of sizes from the scatter
    handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
    ax.legend(handles, labels, loc="best", title="Sizes")

    return ax


def create_chart(json_input: Dict, format: str = "jpeg"):
    plot_type = json_input["__type__"]

    if plot_type != PLOT_TYPE:
        raise ValueError(f"__type__ must be {PLOT_TYPE}")

    for k in list(json_input.keys()):
        if k.startswith("__"):
            del json_input[k]

    ax = fn(**json_input)

    img_stream = io.BytesIO()
    ax.figure.savefig(img_stream, format=format)
    img_stream.seek(0)

    return img_stream
