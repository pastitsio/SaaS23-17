"""Plot objects for each plot type supported by the app.
"""
import io
import numbers
from abc import ABC, abstractmethod
from collections import namedtuple
from typing import Dict, List, Union

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from utils import type2str

matplotlib.use("Agg")  # non interactive


fields = ("type_check", "optional")
defaults = (None, False)
Label = namedtuple("label", fields, defaults=defaults)

MATPLOTLIB_COLORS = 'bgrcmyk'


class Plot(ABC):
    """Parent class for plot types.
    """

    def __init__(self, input_file, chart_data):
        self.input_file = input_file
        self.title = chart_data['title']
        self.x_label = chart_data['x_label']
        self.y_label = chart_data['y_label']
        self.chart_name = chart_data['chart_name']

        self.df = pd.read_csv(input_file, header='infer')

    @property
    @abstractmethod  # implemented at child
    def valid_input(self):
        raise NotImplementedError

    @abstractmethod  # implemented at child
    def _plot_fn(self, **kwargs):
        raise NotImplementedError

    def create_chart(self, img_format: str, mode: str) -> Dict[str, bytes]:
        """Creates images using matplotlib.

        Args:
            img_format (str): either 'all' for
            creating image in all possible formats, or specific format.

            Value checked before on validate().


        Returns:
            Dict[str, bytes]: Dict with (key, value): (img_format, image_as_bytes).
        """
        formats = ['jpeg']  # default
        if img_format == "all":
            formats += ["svg", "png"]

        dpi = 75 if mode == 'preview' else 400

        axis = self._plot_fn()

        images = {}
        for img_format in formats:
            img_stream = io.BytesIO()
            axis.figure.savefig(img_stream, format=img_format, dpi=dpi)
            img_stream.seek(0)
            images[img_format] = img_stream.getvalue()

        return images

    def validate(self):
        self.validate_file()

    def validate_file(self):
        """Validates input json file per plot type.

        Raises:
            KeyError: Key, necesary for plotting, is missing
            KeyError: Key is misstyped or extra
            ValueError: Length mismatch
            TypeError: Type of input is wrong
        """
        input_keys = set(self.df.columns)
        valid_keys = set(self.valid_input.keys())

        # * 1. check all keys are present
        if len(valid_keys - input_keys) != 0:
            necessary_keys = []
            for k in valid_keys - input_keys:
                if not self.valid_input[k].optional:
                    necessary_keys.append(k)
            if len(necessary_keys):
                raise KeyError(
                    f"Necessary keys, not present: {necessary_keys}. Check mistypes or incomplete columns")

        # * 2. check no extra keys
        if len(input_keys - valid_keys) != 0:
            raise KeyError(
                f"Redundant keys, not needed: {input_keys - valid_keys}")

        # * 3. check cols are same length
        column_lengths = self.df.apply(lambda col: len(col), axis=0)
        if not all(length == column_lengths[0] for length in column_lengths):
            raise ValueError('Length mismatch in columns')

        # * 4. check type of content
        for col_name in input_keys:
            fn, error_msg = self.valid_input[col_name].type_check.values()

            if not self.df[col_name].apply(fn).all():
                raise TypeError(
                    f'All values of column: [{col_name}] {error_msg}')


class SimplePlot(Plot):
    """As simple as it gets. (x, y) pairs connected in a linear manner.
    More info on https://matplotlib.org/stable/gallery/lines_bars_and_markers/simple_plot.html
    """

    def __init__(self, input_file, chart_data):
        super().__init__(input_file, chart_data)
        

        self._valid_input = {
            "x": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, numbers.Number)),
                    'error_msg': 'must be numbers'}
            ),
            "y": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, numbers.Number)),
                    'error_msg': 'must be numbers'}
            ),
        }

    def __name__(self):
        return  'Simple Plot'
    
    @property
    def valid_input(self):
        return self._valid_input

    def _plot_fn(self):
        _, axis = plt.subplots()
        axis.plot(self.df['x'], self.df['y'])

        axis.set(xlabel=self.x_label, ylabel=self.y_label, title=self.title)
        axis.grid()

        return axis


class ScatterPlot(Plot):
    """(x, y) pairs un-connected.
    More info on https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html
    """

    def __init__(self, input_file, chart_data):
        super().__init__(input_file, chart_data)
        
        self.df = self.df.rename(columns={'sizes': 's'})

        self._valid_input = {
            "x": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, numbers.Number)),
                    'error_msg': 'must be numbers'}
            ),
            "y": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, numbers.Number)),
                    'error_msg': 'must be numbers'}
            ),
            "colors": Label(
                type_check={
                    'fn': (lambda x: x in MATPLOTLIB_COLORS),
                    'error_msg': f'must be one of {", ".join(MATPLOTLIB_COLORS)}'},
                optional=True
            ),
            "s": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, numbers.Number) and x > 0),
                    'error_msg': 'must be positive numbers'},
                optional=True
            ),
        }
    
    def __name__(self):
        return 'Scatter Plot'

    @property
    def valid_input(self):
        return self._valid_input

    def _plot_fn(self):
        _, axis = plt.subplots()

        optional_keys = [k for k, v in self.valid_input.items() if v.optional]
        config = {}
        for key in optional_keys:
            if key in self.df.columns:
                config[key] = self.df[key].values

        scatter = axis.scatter(
            self.df['x'], self.df['y'], **config)
        axis.set(xlabel=self.x_label, ylabel=self.y_label, title=self.title)

        # ! colors
        if 'c' in config.keys():
            legend1 = axis.legend(*scatter.legend_elements(),
                                  loc="best", title="Categories")
            axis.add_artist(legend1)

        # ! sizes
        if 's' in config.keys():
            handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
            axis.legend(handles, labels, loc="best", title="Sizes")

        return axis


class BarLabelPlot(Plot):
    """More info on https://matplotlib.org/stable/gallery/lines_bars_and_markers/bar_label_demo.html"""

    def __init__(self, input_file, chart_data):
        super().__init__(input_file, chart_data)
        
        try:
            self.bar_width = float(chart_data['bar_width'])
            if self.bar_width <= 0:
                raise ValueError
        except ValueError as e:
            raise ValueError('Bar width should be a number > 0')


        # !! TODO complete
        self._valid_input = {
            "x_labels": Label(
                type_check={
                    'fn': (lambda x: isinstance(x, str)),
                    'error_msg': 'must be strings'}
            )
        }

    def __name__(self):
        return 'Bar Label Plot'

    @property
    def valid_input(self):
        return self._valid_input

    def validate(self):
        self.validate_chart_data()
        self.validate_file()

    def validate_chart_data(self):
        if not isinstance(self.bar_width, numbers.Number):
            if not self.bar_width == '':
                raise TypeError('Bar width should be a number')
            self.bar_width = 0

    def validate_file(self):
        # * 0. check 'x_labels/categories' as first in headers
        if self.df.columns[0] != 'x_labels/categories':
            raise TypeError('First column must be named x_labels/categories')

        # * 1. check at least one header is str.
        if pd.to_numeric(self.df.columns[1:], errors='coerce').notnull().all():
            raise TypeError('At least one header must be of type str')
        
        # * 2. check cols are same length
        column_lengths = self.df.apply(lambda col: len(col), axis=0)
        if not all(length == column_lengths[0] for length in column_lengths):
            raise ValueError('Length mismatch in columns')
        
        # * 3. check type of content / all numeric
        if np.isnan(pd.to_numeric(self.df.iloc[:, 1:].stack(), errors='coerce')).any():
            raise TypeError('Non-number found in a column value')
        

    def _plot_fn(self):
        _, axis = plt.subplots()
        temp_df = self.df.set_index('x_labels/categories')

        bottom = np.zeros(len(temp_df.columns))

        for idx in temp_df.index:
            p = axis.bar(x=temp_df.columns,
                         height=temp_df.loc[idx].tolist(),
                         width=self.bar_width,
                         label=idx,
                         bottom=bottom)
            bottom += temp_df.loc[idx].tolist()

            axis.bar_label(p, label_type="center")

        axis.set_title(self.title)
        axis.legend()

        return axis
