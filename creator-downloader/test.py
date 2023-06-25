import pandas as pd
import matplotlib.pyplot as plt, mpld3
import numpy as np

df = pd.read_csv('../front-end/public/presets/bar_label_plot.csv', header='infer')
df.set_index('x_labels/categories', inplace=True)

_, axis = plt.subplots(dpi=150)
bottom = np.zeros(len(df.columns))

for idx in df.index:
    p = axis.bar(df.columns, df.loc[idx].tolist(), 0.6, label=idx, bottom=bottom)
    bottom += df.loc[idx].tolist()

    axis.bar_label(p, label_type="center")

axis.legend()
with open("./test.html", 'a+') as f:
    f.write(mpld3.fig_to_html(axis.figure))
plt.show()
