import json 
from charts import create_chart

def main():
    with open('../mock-server-download/preset1.json', 'r') as f:
        json_data = json.load(f) 
        
        format = 'svg'
        img_stream = create_chart(json_data, format)
        with open(f'./image.{format}', 'wb') as file:
            file.write(img_stream)

if __name__ == '__main__':
    main()
