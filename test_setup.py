import g4f
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

# Define memory structure
class State(TypedDict):
    conversation: List[dict]  # Stores past messages
    text: str  # Stores the current text input
    classification: str  # Stores text classification
    entities: List[str]  # Stores extracted entities
    summary: str  # Stores summarized text

# Initialize memory
memory: State = {"conversation": [], "text": "", "classification": "", "entities": [], "summary": ""}

def classification_node(state: State):
    """
    Classifies text into predefined categories using g4f.
    """
    prompt = f"Classify the following text into one of the categories: News, Blog, Research, or Other.\n\nText: {state['text']}\n\nCategory:"
    
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    classification_result = response.strip()
    return {"classification": classification_result}

def entity_extraction_node(state: State):
    """
    Extracts named entities (Person, Organization, Location) from text using g4f.
    """
    prompt = f"Extract all the entities (Person, Organization, Location) from the following text. Provide the result as a comma-separated list.\n\nText: {state['text']}\n\nEntities:"
    
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    entities_result = response.strip().split(", ")
    return {"entities": entities_result}

def summarization_node(state: State):
    """
    Summarizes the given text into one short sentence using g4f.
    """
    prompt = f"Summarize the following text in one short sentence:\n\nText: {state['text']}\n\nSummary:"
    
    response = g4f.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    summary_result = response.strip()
    return {"summary": summary_result}

# 🔹 Finalizing the Agent Structure (StateGraph Workflow)
workflow = StateGraph(State)

# Add nodes to the graph
workflow.add_node("classification_node", classification_node)
workflow.add_node("entity_extraction", entity_extraction_node)
workflow.add_node("summarization", summarization_node)

# Define workflow structure
workflow.set_entry_point("classification_node")  # Start at classification
workflow.add_edge("classification_node", "entity_extraction")
workflow.add_edge("entity_extraction", "summarization")
workflow.add_edge("summarization", END)

# Compile the workflow
app = workflow.compile()

# 🔹 Testing the full agent workflow
text_to_process = "Apple has unveiled its latest iPhone 16 series at the Worldwide Developers Conference (WWDC). The new models boast improved battery life, advanced AI-driven photography, and an eco-friendly design made from 100'%' recycled materials."
state = {"text": text_to_process, "conversation": [], "classification": "", "entities": [], "summary": ""}

# Run the workflow on the input text
output = app.invoke(state)

# Print final results
print("🚀 Agent Workflow Completed!")
print(f"📌 Text Classification: {output['classification']}")
print(f"📌 Extracted Entities: {output['entities']}")
print(f"📌 Summary: {output['summary']}")
