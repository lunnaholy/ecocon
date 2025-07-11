import uvicorn

if __name__ == "__main__":
  uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=5123,
    reload=True,
    reload_dirs=["."],
    workers=1
  ) 