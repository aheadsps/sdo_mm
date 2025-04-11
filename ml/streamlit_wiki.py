import streamlit as st
from opensearchpy import OpenSearch, helpers
import PyPDF2
import os
import base64
import requests
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
            print("Успешное подключение к OpenSearch.")
    except Exception as e:
        print(f"Не удалось подключиться к OpenSearch: {e}")
        st.session_state['error'] = "Сервис недоступен"

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

def index_pdf(file_data, filename):
    """
    Индексирует содержимое PDF файла в OpenSearch.
    """
    create_opensearch_index()
    try:
        encoded_data = base64.b64encode(file_data).decode('utf-8')
        response = osrch.index(index="pdf_files", body={"filename": filename, "file_data": encoded_data})
        
        if response["result"] != "created":
            print(f"Ошибка при индексации PDF файла: {response}")
    except Exception as e:
        print(f"Ошибка при индексации PDF файла: {e}")

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

def load_pdf(file_obj):
    try:
        reader = PyPDF2.PdfReader(file_obj)
        text_list = [page.extract_text() or "" for page in reader.pages]
        full_text = "\n".join(text_list)
        return [paragraph.strip() for paragraph in full_text.split("\n\n") if paragraph.strip()]
    except Exception as e:
        print(f"Ошибка при обработке PDF: {e}")
        st.session_state['error'] = "Не удалось обработать PDF файл"

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
        st.session_state['error'] = "Поиск не удался"

st.title("Загрузка и поиск PDF")

uploaded_file = st.file_uploader("Загрузите PDF файл", type="pdf")
if uploaded_file is not None:
    with st.spinner('Обработка...'):
        file_data = uploaded_file.read()
        chunks = load_pdf(uploaded_file)
        index_chunks(chunks, uploaded_file.name)
        index_pdf(file_data, uploaded_file.name)
        st.success(f"Файл загружен и индексирован: {uploaded_file.name}")

search_query = st.text_input("Поиск по ключевому слову")
if search_query:
    results = search_opensearch(search_query)
    if results:
        for result in results:
            st.markdown(f"**Содержимое:** {result['content']} \n\n**Из файла:** {result['source']}")
    else:
        st.write("Результаты не найдены.")
