from model import ModelHandler
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_model():
    try:
        # Initialize the model
        logger.info("Initializing model...")
        start_time = time.time()
        model_handler = ModelHandler()
        load_time = time.time() - start_time
        logger.info(f"Model loaded in {load_time:.2f} seconds")
        
        # Check if model is ready
        if model_handler.is_model_ready():
            logger.info("✅ Model is loaded successfully!")
        else:
            logger.error("❌ Model failed to load!")
            return
        
        # Test cases
        test_queries = [
            "What are the common symptoms of a cold?",
            "How can I prevent the flu?",
            "What is a healthy diet?"
        ]
        
        for query in test_queries:
            logger.info(f"\nTesting query: {query}")
            logger.info("-" * 50)
            
            # Generate response
            start_time = time.time()
            response = model_handler.generate_response(query)
            response_time = time.time() - start_time
            
            # Print the response
            logger.info(f"Response (generated in {response_time:.2f} seconds):")
            logger.info(response)
            logger.info("-" * 50)
            
            # Basic response validation
            if len(response) < 50:
                logger.warning("⚠️ Response seems too short")
            if "not a doctor" not in response.lower():
                logger.warning("⚠️ Medical disclaimer might be missing")
            
        logger.info("\n✅ Model test completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error during model test: {str(e)}")

if __name__ == "__main__":
    test_model() 