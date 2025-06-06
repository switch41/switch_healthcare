from app.model import ModelHandler
import time

def test_model():
    print("Initializing model...")
    model = ModelHandler()
    
    # Wait for model to be ready
    while not model.is_model_ready():
        print("Waiting for model to load...")
        time.sleep(2)
    
    print("\nModel is ready! Testing with some example queries...\n")
    
    # Example queries to test the model
    test_queries = [
        "What are the common symptoms of diabetes?",
        "How can I maintain a healthy diet?",
        "What is the recommended amount of daily exercise?",
    ]
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        print("-" * 50)
        try:
            response = model.generate_response(query)
            print(f"Response:\n{response}")
        except Exception as e:
            print(f"Error generating response: {str(e)}")
        print("-" * 50)

if __name__ == "__main__":
    test_model() 