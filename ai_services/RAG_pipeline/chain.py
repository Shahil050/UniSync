from pypdf import PdfReader

def load_document(pdf_path:str)->str:
    reader=PdfReader(pdf_path) # Reads the file from path
    full_text=""   # assigning all the extracted text from pdf as String

    for page_num,page in enumerate(reader.pages):
        page_text=page.extract_text()
        if page_text:
            full_text += f"\n\n---Page {page_num +1} ---\n"
            full_text += page_text

    return full_text
