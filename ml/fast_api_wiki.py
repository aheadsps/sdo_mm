from fastapi import FastAPI, UploadFile, File, HTTPException
from opensearchpy import OpenSearch, helpers
import PyPDF2
import os
import requests
import base64

app = FastAPI()

osrch = OpenSearch(hosts=["http://localhost:9200"], timeout=3600)
opensearch_url = "http://localhost:9200"

def unlock_opensearch_cluster(opensearch_url):
    url = f"{opensearch_url}/_cluster/settings"
    headers = {"Content-Type": "application/json"}
    data = {
        "persistent": {
            "cluster.blocks.read_only": False,
            "cluster.blocks.read_only_allow_delete": False
        }
    }
    try:
        response = requests.put(url, json=data, headers=headers)
        if response.status_code == 200:
            print("Блокировки успешно сняты.")
        else:
            print(f"Не удалось снять блокировки: {response.status_code} - {response.text}")
    except requests.RequestException as e:
        print(f"Ошибка: {e}")

unlock_opensearch_cluster(opensearch_url)

def check_opensearch_connection():
    try:
        response = osrch.info()
        if response:
            print("Successfully connected to OpenSearch.")
    except Exception as e:
        print(f"Failed to connect to OpenSearch: {e}")
        raise HTTPException(status_code=503, detail="Service Unavailable")

check_opensearch_connection()

def create_opensearch_index():
    try:
        if not osrch.indices.exists(index="chunks"):
            osrch.indices.create(
                index="chunks",
                body={
                    "settings": {
                        "analysis": {
                            "analyzer": {"default": {"type": "russian"}}
                        }
                    }
                },
            )
        if not osrch.indices.exists(index="pdf_files"):
            osrch.indices.create(
                index="pdf_files"
            )
    except Exception as e:
        print(f"Ошибка при создании индексов: {e}")

def index_pdf(file_obj, filename):
    """
    Индексирует содержимое PDF файла в OpenSearch.
    """
    create_opensearch_index()
    try:
        # Считываем двоичные данные
        file_data = file_obj.read()
        
        # Кодируем данные в base64
        encoded_data = base64.b64encode(file_data).decode('utf-8')
        
        # Отправляем закодированные данные в OpenSearch
        response = osrch.index(index="pdf_files", body={"filename": filename, "file_data": encoded_data})
        
        if response["result"] != "created":
            print(f"Ошибка при индексации PDF файла: {response}")
    except Exception as e:
        print(f"Ошибка при индексации PDF файла: {e}")
        raise HTTPException(status_code=500, detail="Failed to index PDF file")

def index_chunks(chunks, source):
    create_opensearch_index()
    actions = (
        {
            "_op_type": "index",
            "_index": "chunks",
            "_source": {"chunk_number": i + 1, "source": source, "content": chunk}
        }
        for i, chunk in enumerate(chunks)
    )
    try:
        helpers.bulk(osrch, actions, refresh=True)
    except Exception as e:
        print(f"Ошибка при индексации чанков: {e}")
        raise HTTPException(status_code=500, detail="Indexing chunks failed")

def load_pdf(file_obj):
    try:
        reader = PyPDF2.PdfReader(file_obj)
        text_list = [page.extract_text() or "" for page in reader.pages]
        full_text = "\n".join(text_list)
        return [paragraph.strip() for paragraph in full_text.split("\n\n") if paragraph.strip()]
    except Exception as e:
        print(f"Ошибка при обработке PDF: {e}")
        raise HTTPException(status_code=500, detail="Не удалось обработать PDF файл")

def search_opensearch(keyword):
    try:
        response = osrch.search(
            index="chunks",
            body={"query": {"match": {"content": {"query": keyword, "operator": "and", "fuzziness": "1"}}}},
            size=10000,
        )
        return [{"content": hit["_source"]["content"], "source": hit["_source"]["source"]} for hit in response["hits"]["hits"]]
    except Exception as e:
        print(f"Ошибка при поиске: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        file_obj = file.file
        chunks = load_pdf(file_obj)
        index_chunks(chunks, file.filename)
        file_obj.seek(0)
        index_pdf(file_obj, file.filename)
    except Exception as e:
        print(f"Ошибка при загрузке и индексации файла: {e}")
        raise HTTPException(status_code=500, detail="Failed to process PDF")

    return {"filename": file.filename, "chunks_indexed": len(chunks)}

@app.get("/search/")
def search(keyword: str):
    results = search_opensearch(keyword)
    return {"keyword": keyword, "results": results}

@app.get("/pdf/")
def get_pdf(filename: str):
    try:
        response = osrch.search(
            index="pdf_files",
            body={"query": {"match": {"filename": {"query": filename}}}},
            size=1
        )
        if response["hits"]["hits"]:
            pdf_data = response["hits"]["hits"][0]["_source"]["file_data"]
            return {"filename": filename, "pdf_data": pdf_data}
        else:
            raise HTTPException(status_code=404, detail="PDF not found")
    except Exception as e:
        print(f"Ошибка при получении PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve PDF")
