import streamlit as st
import PyPDF2
import os
import base64
import requests
from opensearchpy import OpenSearch, helpers

PDF_STORAGE_DIR = "./pdf_storage"
os.makedirs(PDF_STORAGE_DIR, exist_ok=True)

osrch = OpenSearch(hosts=["http://localhost:9200"], timeout=3600)
opensearch_url = "http://localhost:9200"

# Utility functions
def unlock_opensearch_cluster():
    url = f"{opensearch_url}/_cluster/settings"
    headers = {"Content-Type": "application/json"}
    data = {
        "persistent": {
            "cluster.blocks.read_only": False,
            "cluster.blocks.read_only_allow_delete": False
        }
    }
    try:
        requests.put(url, json=data, headers=headers)
    except requests.RequestException as e:
        st.error(f"Ошибка при разблокировке OpenSearch: {e}")

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
            osrch.indices.create(index="pdf_files")
    except Exception as e:
        st.error(f"Ошибка при создании индексов: {e}")

def index_pdf(file_path, filename):
    try:
        with open(file_path, "rb") as file_obj:
            file_data = file_obj.read()
            encoded_data = base64.b64encode(file_data).decode('utf-8')
            osrch.index(index="pdf_files", body={"filename": filename, "file_data": encoded_data})
    except Exception as e:
        st.error(f"Ошибка при индексации PDF: {e}")

def index_chunks(chunks, source):
    actions = (
        {
            "_op_type": "index",
            "_index": "chunks",
            "_source": {
                "chunk_number": i + 1,
                "source": source,
                "content": chunk,
                "page": page
            }
        }
        for i, (page, chunk) in enumerate(chunks)
    )
    try:
        helpers.bulk(osrch, actions, refresh=True)
    except Exception as e:
        st.error(f"Ошибка при индексации чанков: {e}")

def load_pdf(file_path):
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            result = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                for paragraph in text.split("\n\n"):
                    cleaned = paragraph.strip()
                    if cleaned:
                        result.append((i + 1, cleaned))
            return result
    except Exception as e:
        st.error(f"Ошибка при обработке PDF: {e}")
        return []

def search_opensearch(keyword):
    try:
        response = osrch.search(
            index="chunks",
            body={
                "query": {
                    "match": {
                        "content": {
                            "query": keyword,
                            "operator": "and",
                            "fuzziness": "1"
                        }
                    }
                }
            },
            size=10000,
        )
        return [
            {
                "content": hit["_source"]["content"],
                "source": hit["_source"]["source"],
                "page": hit["_source"].get("page"),
                "link": f"{PDF_STORAGE_DIR}/{hit['_source']['source']}#page={hit['_source'].get('page', 1)}"
            }
            for hit in response["hits"]["hits"]
        ]
    except Exception as e:
        st.error(f"Ошибка при поиске: {e}")
        return []

# Streamlit UI
st.title("PDF Загрузка и Поиск по Чанкам")

unlock_opensearch_cluster()
create_opensearch_index()

menu = st.sidebar.selectbox("Меню", ["Загрузить PDF", "Поиск"])

if menu == "Загрузить PDF":
    uploaded_file = st.file_uploader("Выберите PDF файл", type=["pdf"])
    if uploaded_file is not None:
        filename = uploaded_file.name
        file_path = os.path.join(PDF_STORAGE_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.read())
        st.success(f"Файл {filename} загружен.")

        chunks = load_pdf(file_path)
        if chunks:
            index_pdf(file_path, filename)
            index_chunks(chunks, filename)
            st.success(f"Проиндексировано чанков: {len(chunks)}")

elif menu == "Поиск":
    query = st.text_input("Введите ключевое слово для поиска")
    if query:
        results = search_opensearch(query)
        if results:
            for res in results:
                st.markdown(f"**Файл:** [{res['source']}]({res['link']}) | Страница: {res['page']}")
                st.write(res['content'])
        else:
            st.warning("Ничего не найдено.")
