from transformers import AutoTokenizer
import onnxruntime as ort

tokenizer=AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

session= ort.InferenceSession("sentence-transformers/all-MiniLM-L6-v2")