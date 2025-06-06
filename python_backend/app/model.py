from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import logging
import os
import time

# Disable symlinks warning
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelHandler:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        if torch.cuda.is_available():
            logger.info(f"GPU: {torch.cuda.get_device_name(0)}")
            torch.cuda.empty_cache()
        self.load_model()
        
    def load_model(self):
        """Load the model and tokenizer"""
        try:
            logger.info("Loading medical model...")
            # Using a smaller model for faster loading and inference
            model_name = "microsoft/BioGPT"  # Smaller version of BioGPT
            cache_dir = os.path.join(os.path.dirname(__file__), "model_cache")
            os.makedirs(cache_dir, exist_ok=True)
            
            # Try to load from cache first
            try:
                logger.info("Attempting to load from cache...")
                self.tokenizer = AutoTokenizer.from_pretrained(
                    model_name,
                    local_files_only=True,
                    cache_dir=cache_dir
                )
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    device_map="auto" if torch.cuda.is_available() else None,
                    local_files_only=True,
                    cache_dir=cache_dir,
                    low_cpu_mem_usage=True
                )
                logger.info("Successfully loaded from cache")
            except Exception as cache_error:
                logger.info(f"Cache load failed: {str(cache_error)}")
                logger.info("Downloading model...")
                
                # Try downloading with retries
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        self.tokenizer = AutoTokenizer.from_pretrained(
                            model_name,
                            cache_dir=cache_dir
                        )
                        self.model = AutoModelForCausalLM.from_pretrained(
                            model_name,
                            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                            device_map="auto" if torch.cuda.is_available() else None,
                            cache_dir=cache_dir,
                            low_cpu_mem_usage=True
                        )
                        logger.info("Successfully downloaded and loaded model")
                        break
                    except Exception as download_error:
                        if attempt < max_retries - 1:
                            logger.warning(f"Download attempt {attempt + 1} failed: {str(download_error)}")
                            time.sleep(2)  # Wait before retrying
                        else:
                            raise download_error

            # Move model to appropriate device
            if not torch.cuda.is_available():
                self.model = self.model.to(self.device)
            else:
                self.model.eval()
                torch.cuda.empty_cache()
                
            logger.info("Model setup complete")
            
        except Exception as e:
            logger.error(f"Error in model loading: {str(e)}")
            raise

    def is_model_ready(self) -> bool:
        """Check if the model is loaded and ready to use"""
        return self.model is not None and self.tokenizer is not None

    def generate_response(self, message: str, max_new_tokens: int = 400) -> str:
        """Generate a response using the model"""
        if not self.is_model_ready():
            raise RuntimeError("Model not loaded. Please check the initialization.")

        try:
            # Simplified prompt for analysis
            prompt = f"""As a medical information assistant, analyze the following symptoms and provide a possible preliminary assessment. Be clear about limitations and the need to consult a healthcare professional.

Symptoms: {message}

Assessment:"""

            # Prepare the input
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            
            # Generate response with optimized parameters
            with torch.no_grad(), torch.cuda.amp.autocast() if torch.cuda.is_available() else torch.no_grad():
                outputs = self.model.generate(
                    input_ids,
                    max_new_tokens=max_new_tokens,
                    num_beams=4,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9,
                    top_k=50,
                    repetition_penalty=1.2,
                    no_repeat_ngram_size=3,
                    num_return_sequences=1,
                    pad_token_id=self.tokenizer.eos_token_id,
                    length_penalty=1.0,
                    early_stopping=True
                )

            # Decode the response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # --- Start: Return raw response --- 
            # Returning the raw decoded response to see the full output
            return response
            # --- End: Return raw response --- 

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise 