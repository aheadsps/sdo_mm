import streamlit as st
import PyPDF2
import io
import base64
import requests
from opensearchpy import OpenSearch, helpers

st.set_page_config(page_title="PDF Search App", layout="wide")

# Connect to OpenSearch
osrch = OpenSearch(hosts=["http://localhost:9200"], timeout=3600)
opensearch_url = "http://localhost:9200"

# Initialization
PDF_INDEX = "pdf_files"
CHUNKS_INDEX = "chunks"

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
        if not osrch.indices.exists(index=CHUNKS_INDEX):
            osrch.indices.create(
                index=CHUNKS_INDEX,
                body={
                    "settings": {
                        "analysis": {
                            "analyzer": {"default": {"type": "russian"}}
                        }
                    }
                },
            )
        if not osrch.indices.exists(index=PDF_INDEX):
            osrch.indices.create(index=PDF_INDEX)
    except Exception as e:
        st.error(f"Ошибка при создании индексов: {e}")

def index_pdf(file_bytes: bytes, filename: str):
    try:
        encoded_data = base64.b64encode(file_bytes).decode('utf-8')
        osrch.index(index=PDF_INDEX, body={"filename": filename, "file_data": encoded_data})
    except Exception as e:
        st.error(f"Ошибка при индексации PDF: {e}")

def index_chunks(chunks, source):
    actions = (
        {
            "_op_type": "index",
            "_index": CHUNKS_INDEX,
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

def load_pdf(file_bytes: bytes):
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        result = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            for paragraph in text.split("\n\n"):
                cleaned = paragraph.strip()
                if cleaned:
                    result.append((i + 1, cleaned))
        return result
    except Exception as e:
        st.error(f"Ошибка при разборе PDF: {e}")
        return []

def search_opensearch(keyword):
    try:
        response = osrch.search(
            index=CHUNKS_INDEX,
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
                "link": f"/pdf/{hit['_source']['source']}#page={hit['_source'].get('page', 1)}"
            }
            for hit in response["hits"]["hits"]
        ]
    except Exception as e:
        st.error(f"Ошибка при поиске: {e}")
        return []

def retrieve_pdf_bytes(filename: str):
    try:
        response = osrch.search(
            index=PDF_INDEX,
            body={"query": {"match": {"filename": filename}}},
            size=1
        )
        hits = response["hits"]["hits"]
        if not hits:
            return None
        encoded = hits[0]['_source']['file_data']
        return base64.b64decode(encoded)
    except Exception as e:
        st.error(f"Ошибка при получении PDF: {e}")
        return None

# UI
st.title("📄 PDF Обработка и Поиск по OpenSearch")
unlock_opensearch_cluster()
create_opensearch_index()

menu = st.sidebar.radio("Навигация", ["Загрузить PDF", "Поиск"])

if menu == "Загрузить PDF":
    uploaded_file = st.file_uploader("Выберите PDF", type=["pdf"])
    if uploaded_file is not None:
        file_bytes = uploaded_file.read()
        chunks = load_pdf(file_bytes)
        if chunks:
            index_pdf(file_bytes, uploaded_file.name)
            index_chunks(chunks, uploaded_file.name)
            st.success(f"✅ Загружено и проиндексировано {len(chunks)} фрагментов")

elif menu == "Поиск":
    keyword = st.text_input("🔍 Введите слово для поиска по PDF")
    if keyword:
        results = search_opensearch(keyword)
        if results:
            for i, res in enumerate(results):
                st.markdown(f"**Файл:** `{res['source']}` | Страница: {res['page']}")
                st.write(res['content'])
                if st.button(f"Скачать {res['source']}", key=f"btn_{res['source']}_{res['page']}_{i}"):
                    pdf_data = retrieve_pdf_bytes(res['source'])
                    if pdf_data:
                        st.download_button(
                            label="📥 Скачать PDF",
                            data=pdf_data,
                            file_name=res['source'],
                            mime="application/pdf",
                            key=f"download_{res['source']}_{i}"
                        )
        else:
            st.info("Ничего не найдено по данному запросу.")
