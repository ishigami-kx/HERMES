import os
import time
import tempfile
import psutil
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from faster_whisper import WhisperModel

app = FastAPI(title="DeafAssist Local Whisper API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "base")
whisper_models = {}

def get_whisper_model(model_size: str = "base") -> WhisperModel:
    global whisper_models
    if model_size not in whisper_models:
        print(f"[DeafAssist Backend] Loading model '{model_size}' (CPU, int8, cpu_threads=4)...")
        whisper_models[model_size] = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
            cpu_threads=4,
        )
        print(f"[DeafAssist Backend] Model '{model_size}' ready.")
    return whisper_models[model_size]


class TranscribeResponse(BaseModel):
    text: str
    language: str
    latency_ms: float
    model_size: str


class SwitchModelRequest(BaseModel):
    model_size: str


@app.get("/health")
def health_check():
    cpu_percent = psutil.cpu_percent(interval=None)
    ram = psutil.virtual_memory()
    return {
        "status": "healthy",
        "active_model": CURRENT_MODEL_SIZE,
        "loaded_models": list(whisper_models.keys()),
        "device": "cpu",
        "compute_type": "int8",
        "system": {
            "cpu_percent": cpu_percent,
            "ram_used_mb": round((ram.total - ram.available) / (1024 * 1024), 1),
            "ram_total_mb": round(ram.total / (1024 * 1024), 1),
            "ram_percent": ram.percent,
        },
    }


@app.post("/switch-model")
def switch_model(req: SwitchModelRequest):
    global CURRENT_MODEL_SIZE
    valid_sizes = ["tiny", "base"]
    if req.model_size not in valid_sizes:
        raise HTTPException(status_code=400, detail=f"Invalid model size. Choose from: {valid_sizes}")
    get_whisper_model(req.model_size)
    CURRENT_MODEL_SIZE = req.model_size
    return {"status": "ok", "active_model": CURRENT_MODEL_SIZE}


@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form("en"),
    model_size: Optional[str] = Form(None),
):
    start_time = time.perf_counter()
    target_size = model_size if model_size in ["tiny", "base"] else CURRENT_MODEL_SIZE

    # Strict language lock: 'am' or 'en'
    whisper_lang = "am" if language in ["am-ET", "am"] else "en"

    content = await file.read()
    # Skip empty, corrupted, or undersized chunks (< 2KB audio is generally silence or empty header)
    if not content or len(content) < 2048:
        return TranscribeResponse(
            text="",
            language=whisper_lang,
            latency_ms=0.0,
            model_size=target_size,
        )

    suffix = os.path.splitext(file.filename or "")[1] or ".webm"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        temp_file.write(content)
        temp_file.flush()
        temp_file.close()

        model = get_whisper_model(target_size)

        # Transcribe strictly with:
        # 1. language lock ('am' or 'en')
        # 2. condition_on_previous_text=False to kill repetition loops across sequential chunks
        # 3. vad_filter=True to ignore quiet gaps and save CPU time
        # 4. beam_size=1 (greedy) for fastest CPU decoding
        segments, _ = model.transcribe(
            temp_file.name,
            language=whisper_lang,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=400),
            condition_on_previous_text=False,
            beam_size=1,
            temperature=0.0,
            no_speech_threshold=0.6,
        )

        recognized_parts = []
        for seg in segments:
            clean = seg.text.strip()
            if clean and clean not in recognized_parts:
                recognized_parts.append(clean)

        recognized_text = " ".join(recognized_parts).strip()
        latency = round((time.perf_counter() - start_time) * 1000, 2)

        return TranscribeResponse(
            text=recognized_text,
            language=whisper_lang,
            latency_ms=latency,
            model_size=target_size,
        )

    except Exception as e:
        print(f"[Transcribe Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file.name):
            try:
                os.remove(temp_file.name)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn
    get_whisper_model(CURRENT_MODEL_SIZE)
    uvicorn.run(app, host="127.0.0.1", port=8000)
