"""Plot objects for each plot type supported by the app.
"""
import io
from abc import ABC, abstractmethod
from typing import Dict, List, Union

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from utils import Label, type2str

matplotlib.use("Agg")  # non interactive


class Plot(ABC):
    """Parent class for plot types.
    """
    def __init__(self, json_input: Dict):
        """Must be called after child's __init__()"""
        self.json_input = json_input.copy()
        self.plot_type = self.json_input["__type__"]

        # remove redundant keys
        redundant = set(self.json_input.keys()).difference(set(self.valid_input.keys()))
        for key in redundant:
            del self.json_input[key]

    @property
    @abstractmethod # implemented at child
    def valid_input(self): # pylint: disable=missing-function-docstring
        raise NotImplementedError

    @property
    @abstractmethod  # implemented at child
    def matching_pairs(self): # pylint: disable=missing-function-docstring
        raise NotImplementedError

    @abstractmethod  # implemented at child
    def _plot(self, **kwargs): # pylint: disable=missing-function-docstring
        raise NotImplementedError

    def create_chart(self, img_format: Union[str, List[str]]) -> Dict[str, bytes]:
        """Creates images using matplotlib.

        Args:
            img_format (Union[str, List[str]]): either 'all' for
            creating image in all posible formats,or list of str formats.
            
            Value checked before on validate().


        Returns:
            Dict[str, bytes]: Dict with (key, value): (img_format, image_as_bytes).
        """
        if img_format == "all":
            formats = ["jpeg", "svg", "png"]
        else:
            formats = [
                img_format,
            ]
        axisis = self._plot(**self.json_input)

        images = {}
        for img_format in formats:
            img_stream = io.BytesIO()
            axisis.figure.savefig(img_stream, format=img_format)
            img_stream.seek(0)
            images[img_format] = img_stream.getvalue()

        return images

    def validate(self):
        """Validates input json file per plot type.

        Raises:
            KeyError: Key, necesary for plotting, is missing
            KeyError: Key is misstyped or extra
            TypeError: Type of input is wrong
            ValueError: Length mismatch on a pair
        """
        # !! TODO: use matplotlib.errors instead
        # check if key is missing
        for key in set(self.valid_input.keys()).difference(set(self.json_input.keys())):
            if not key.optional:
                raise KeyError(f"Missing {key}, necessary for plot.")

        for key in self.json_input.keys():
            # check: all keys are present
            if key not in self.valid_input.keys():
                keys_list = sorted(self.valid_input.keys())
                raise KeyError(f"Key [{key}] should be one of: {keys_list}")
            # check: type is valid for every dimension
            valid_key = self.valid_input[key]
            dim_check = [self.json_input[key]]
            for dim in range(valid_key.ndim + 1):
                content_type = valid_key.is_type[dim]
                if not all(isinstance(element, content_type) for element in dim_check):
                    raise TypeError(
                        f"Dimension [{dim}] of key [{key}] \
                            should be of type: {type2str(content_type)}"
                    )
                dim_check = dim_check[0]

        # check: axisis mismatch
        for pair in self.matching_pairs:
            len1 = len(self.json_input[pair[0]])
            len2 = len(self.json_input[pair[1]])
            if len1 != len2:
                raise ValueError(
                    f"[Size of {pair[0]}: {len1}] must equal [Size of y: {len2}]"
                )


class SimplePlot(Plot):
    """As simple as it gets. (x, y) pairs connected in a linear manner.
    More info on https://matplotlib.org/stable/gallery/lines_bars_and_markers/simple_plot.html
    """
    def __init__(self, json_input: Dict):
        self._valid_input = {
            "x": Label(is_type=[List, (int, float)], ndim=1),
            "y": Label(is_type=[List, (int, float)], ndim=1),
            "x_label": Label(is_type=[str], optional=True),
            "y_label": Label(is_type=[str], optional=True),
            "title": Label(is_type=[str], optional=True),
        }
        self._matching_pairs = (["x", "y"],)

        super().__init__(json_input)

    @property
    def valid_input(self):
        return self._valid_input

    @property
    def matching_pairs(self):
        return self._matching_pairs

    def _plot(self, x: List, y: List, x_label: str, y_label: str, title: str): # pylint: disable=arguments-differ
        _, axis = plt.subplots()
        axis.plot(x, y)

        axis.set(xlabel=x_label, ylabel=y_label, title=title)
        axis.grid()

        return axis


class ScatterPlot(Plot):
    """(x, y) pairs un-connected.
    More info on https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html
    """
    def __init__(self, json_input: Dict):
        super().__init__(json_input)

        # !! TODO complete
        self._valid_input = {
            "x": Label(is_type=[List, (int, float)], ndim=1),
            "y": Label(is_type=[List, (int, float)], ndim=1),
            "x_label": Label(is_type=[str], optional=True),
            "y_label": Label(is_type=[str], optional=True),
            "title": Label(is_type=[str], optional=True),
            "colors": Label(is_type=[List, str], ndim=1, optional=True),
            "sizes": Label(is_type=[List, str], ndim=1, optional=True),
        }

        self._matching_pairs = [
            ("x", "y"),
        ]
        # if color

    @property
    def valid_input(self):
        return self._valid_input

    @property
    def matching_pairs(self):
        return self._matching_pairs

    def _plot( # pylint: disable=arguments-differ
        self,
        x: List, y: List,
        x_label: str, y_label: str,
        title: str,
        colors: List = None, sizes: List = None,
    ):
        _, axis = plt.subplots()

        scatter = axis.scatter(x, y, c=colors, s=sizes)

        # produce a legend with the unique colors from the scatter
        legend1 = axis.legend(*scatter.legend_elements(), loc="best", title="Classes")
        axis.add_artist(legend1)

        # produce a legend with a cross-section of sizes from the scatter
        handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
        axis.set(xlabel=x_label, ylabel=y_label, title=title)
        axis.legend(handles, labels, loc="best", title="Sizes")

        return axis


class BarLabelPlot(Plot):
    """More info on https://matplotlib.org/stable/gallery/lines_bars_and_markers/bar_label_demo.html"""
    def __init__(self, json_input: Dict):
        super().__init__(json_input)

        # !! TODO complete
        self._valid_input = []
        self._matching_pairs = []

    @property
    def valid_input(self):
        return self._valid_input

    @property
    def matching_pairs(self):
        return self._matching_pairs

    def _plot(self, x_labels: List[str], bar_counts: Dict[str, List], title: str): # pylint: disable=arguments-differ
        width = 0.6  # bar width

        _, axis = plt.subplots()
        bottom = np.zeros(len(x_labels))

        for _label, label_count in bar_counts.items():
            p = axis.bar(x_labels, label_count, width, label=_label, bottom=bottom)
            bottom += label_count

            axis.bar_label(p, label_type="center")

        axis.set_title(title)
        axis.legend()

        return axis

