FROM python:3.10-slim

WORKDIR /app
COPY procurement_neg_agents/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY procurement_neg_agents/ .

EXPOSE 8080 443 80

CMD ["python", "-m", "main.py"]