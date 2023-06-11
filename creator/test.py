import json
import matplotlib
from models.plot import SimplePlot
matplotlib.use('QtAgg')

with open('../mock-server-download/presets/preset1.json', 'r') as f:
  data = json.load(f)

p = SimplePlot(data)
p.validate()

img = p.create_chart('jpeg')['svg']
print(img)