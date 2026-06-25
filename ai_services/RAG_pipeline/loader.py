from pypdf import PdfReader

def load_document(pdf_path:str)->str:
    reader=PdfReader(pdf_path)
    full_text=""
    for page_num,page in enumerate(reader.pages):
        page_text=page.extract_text()
        if page_text:
            full_text += f"\n\n---Page {page_num +1} ---\n"
            full_text += page_text

    return full_text