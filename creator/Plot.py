import io
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

from abc import ABC, abstractmethod
from typing import Dict, List

from config import config
from utils import label, _type_name, snake_to_camel

matplotlib.use("Agg")  # non interactive

PLOT_TYPES = config["PLOT"]["TYPES"]

class Plot(ABC):
    def __new__(cls, json_input: Dict, is_validated: bool = False):
        plot_type = json_input["__type__"]
        if plot_type not in PLOT_TYPES:
            raise ValueError(f"__type__ must be one of {PLOT_TYPES}")

        _class = globals()[snake_to_camel(plot_type)]

        return super().__new__(_class)

    def __init__(self, json_input: Dict, is_validated: bool):
        self.is_validated = is_validated
        self.json_input = json_input
        self.plot_type = self.json_input["__type__"]

        for k in list(self.json_input.keys()):
            if k.startswith("__"):
                del self.json_input[k]

    @abstractmethod
    def _plot(self, **args):
        raise NotImplementedError

    def create_chart(self, format: str = "jpeg"):
        ax = self._plot(**self.json_input)

        img_stream = io.BytesIO()
        ax.figure.savefig(img_stream, format=format)
        img_stream.seek(0)

        return img_stream

    def validate(self):
        if not self.is_validated:
            self._validate(self.valid_input, self.matching_pairs)

    def _validate(self, valid_input, matching_pairs):
        for key in self.json_input.keys():
            # check: all keys are present
            if key not in valid_input.keys():
                keys_list = sorted(valid_input.keys())
                raise KeyError(f"Key [{key}] should be one of: {keys_list}")

            # check: type is valid for every dimension
            valid_key = valid_input[key]
            dim_check = [self.json_input[key]]
            for dim in range(valid_key.ndim + 1):
                content_type = valid_key.is_type[dim]
                if not all(isinstance(element, content_type) for element in dim_check):
                    raise TypeError(
                        f"Dimension [{dim}] of key [{key}] should be of type: {_type_name(content_type)}"
                    )
                dim_check = dim_check[0]

        # check: axis mismatch
        for pair in matching_pairs:
            len1 = len(self.json_input[pair[0]])
            len2 = len(self.json_input[pair[1]])
            if len1 != len2:
                raise ValueError(
                    f"[Size of {pair[0]}: {len1}] must equal [Size of y: {len2}]"
                )


class SimplePlot(Plot):
    def __init__(self, json_input: Dict, is_validated: bool = False):
        super().__init__(json_input, is_validated)

        self.valid_input = {
            "x": label(is_type=[List, (int, float)], ndim=1),
            "y": label(is_type=[List, (int, float)], ndim=1),
            "x_label": label(is_type=[str]),
            "y_label": label(is_type=[str]),
            "title": label(is_type=[str]),
        }
        self.matching_pairs = (["x", "y"],)

    def _plot(self, x: List, y: List, x_label: str, y_label: str, title: str):

        _, ax = plt.subplots()
        ax.plot(x, y)

        ax.set(xlabel=x_label, ylabel=y_label, title=title)
        ax.grid()

        return ax


# class ScatterPlot(Plot):
#     def __init__(self, json_input: Dict, is_validated: bool = False):
#         super().__init__(json_input, is_validated)

#         self.valid_input = []

#     def _plot(x: List, y: List, colors: List = None, sizes: List = None):
#         _, ax = plt.subplots()

#         scatter = ax.scatter(x, y, c=colors, s=sizes)

#         # produce a legend with the unique colors from the scatter
#         legend1 = ax.legend(*scatter.legend_elements(), loc="best", title="Classes")
#         ax.add_artist(legend1)

#         # produce a legend with a cross-section of sizes from the scatter
#         handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
#         ax.legend(handles, labels, loc="best", title="Sizes")

#         return ax


# class BarLabelPlot(Plot):
#     def __init__(self, json_input: Dict, is_validated: bool = False):
#         super().__init__(json_input, is_validated)

#         self.valid_input = []

#     def _plot(x_labels: List[str], bar_counts: Dict[str, List], title: str):
#         width = 0.6  # bar width

#         _, ax = plt.subplots()
#         bottom = np.zeros(len(x_labels))

#         for label, label_count in bar_counts.items():
#             p = ax.bar(x_labels, label_count, width, label=label, bottom=bottom)
#             bottom += label_count

#             ax.bar_label(p, label_type="center")

#         ax.set_title(title)
#         ax.legend()

#         return ax
