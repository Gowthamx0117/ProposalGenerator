from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Load the dataset
file_path = 'C:/Users/HP/Desktop/PD/preprocessed_project_description.xlsx'  # Update with your actual file path
df = pd.read_excel(file_path)

# Define required columns
required_columns = ['Category', 'Project Description', 'Solution Overview',
                    'Tools/Technologies Required', 'Industry Needs/Requirements',
                    'Target Audience', 'Expected Outcome', 'Implementation Challenges']

# Clean the data by dropping rows with missing values in required columns
df_clean = df[required_columns].dropna()

# Function to get similar projects
@app.route('/get_similar_projects', methods=['POST'])
def get_similar_projects():
    data = request.get_json()  # Get data from the request
    input_description = data['description']
    selected_category = data['category']
    
    # Filter projects based on the selected category
    filtered_projects = df_clean[df_clean['Category'].str.contains(selected_category, case=False, na=False)]
    
    if not filtered_projects.empty:
        # Vectorize the descriptions
        vectorizer = TfidfVectorizer()
        project_descriptions = filtered_projects['Project Description'].tolist()
        vectorizer.fit(project_descriptions + [input_description])

        # Transform input description and project descriptions into vectors
        input_vector = vectorizer.transform([input_description])
        project_vectors = vectorizer.transform(project_descriptions)

        # Calculate cosine similarity
        similarities = cosine_similarity(input_vector, project_vectors)

        # Get the indices of the most similar projects
        most_similar_indices = similarities.argsort()[0][-5:][::-1]  # Top 5 similar projects

        # Get the most similar projects
        most_similar_projects = filtered_projects.iloc[most_similar_indices]

        return jsonify(most_similar_projects.to_dict(orient='records'))  # Send the result as a JSON response
    else:
        return jsonify({"message": "No projects found for this category."})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
