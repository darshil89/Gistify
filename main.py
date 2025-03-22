import g4f
from typing import TypedDict, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langgraph.graph import StateGraph, END

app = FastAPI()

# Define memory structure
class State(TypedDict):
    text: str
    classification: str
    entities: List[str]
    summary: str

# Request model
class TextRequest(BaseModel):
    text: str

def classification_node(state: State):
    """Classifies text into categories using g4f."""
    prompt = f"Classify this text into News, Blog, Research, or Other:\n\nText: {state['text']}\n\nCategory:"
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"classification": response.strip()}

def entity_extraction_node(state: State):
    """Extracts named entities."""
    prompt = f"Extract all entities (Person, Organization, Location) from this text as a comma-separated list:\n\n{state['text']}"
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"entities": response.strip().split(", ")}

def summarization_node(state: State):
    """Summarizes text into one short sentence."""
    prompt = f"Summarize this text in one short sentence:\n\n{state['text']}"
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"summary": response.strip()}

# Build the workflow
workflow = StateGraph(State)
workflow.add_node("classification_node", classification_node)
workflow.add_node("entity_extraction", entity_extraction_node)
workflow.add_node("summarization", summarization_node)
workflow.set_entry_point("classification_node")
workflow.add_edge("classification_node", "entity_extraction")
workflow.add_edge("entity_extraction", "summarization")
workflow.add_edge("summarization", END)
app_agent = workflow.compile()

@app.post("/process")
async def process_text(request: TextRequest):
    """API endpoint for text processing."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    state = {"text": request.text, "classification": "", "entities": [], "summary": ""}
    output = app_agent.invoke(state)
    return output

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
