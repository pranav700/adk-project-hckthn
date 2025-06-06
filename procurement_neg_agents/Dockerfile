FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY procurement_neg_agents/ .

CMD ["python", "-m", "main.py"]