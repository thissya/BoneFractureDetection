from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt")

CLASS_LABELS = {
    0: "elbow positive",
    1: "fingers positive",
    2: "forearm fracture",
    3: "humerus fracture",
    4: "humerus",
    5: "shoulder fracture",
    6: "wrist positive"
}

@app.route('/predict', methods=['POST'])
def predict():
    image_file = request.files.get('image')
    
    if image_file:
        image = Image.open(image_file)
        
        results = model(image)
        
        predictions = []
        for result in results:
            if hasattr(result, 'boxes'):
                boxes = result.boxes.xyxy.tolist()  
                confidences = result.boxes.conf.tolist()  
                classes = result.boxes.cls.tolist()  
                
                predicted_labels = [CLASS_LABELS.get(int(cls), "Unknown") for cls in classes]
                
                predictions.extend(predicted_labels)
                
                # predictions.append(
                # {
                #     # 'boxes': boxes,
                #     # 'confidences': confidences,
                #     'labels': predicted_labels
                # })

        return jsonify({'predictions': predictions})
    else:
        return jsonify({'error': 'No image provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)

