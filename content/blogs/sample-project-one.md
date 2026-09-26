# Sample Project One

This is a **placeholder post** demonstrating how project write-ups render on
this site. Swap this content out by editing
`content/blogs/sample-project-one.md` — everything you see on this page,
including the title and tags in the header above, comes from data files, not
hardcoded HTML.

Imagine this project is a small FastAPI service that does something useful:
maybe it ingests events, exposes a clean REST API, and ships metrics to a
dashboard. The point of this placeholder is to show off the markdown styling
— headings, lists, code, and links — not to describe a real project.

## Highlights

- Clean, typed request/response models using Pydantic
- Async endpoints backed by a connection-pooled Postgres client
- Structured logging and a `/healthz` endpoint for uptime checks
- ~95% test coverage with `pytest` and `httpx`'s async test client

## How it works

At a high level, the service exposes a handful of REST endpoints, validates
input with Pydantic models, and persists to Postgres through an async driver.
A minimal example of the kind of route you might find:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    quantity: int

@app.post("/items")
async def create_item(item: Item):
    # persist to the database here
    return {"status": "created", "item": item}
```

> Replace this quote block with a real design note, trade-off, or lesson
> learned once you write about an actual project.

## Links

Check out the real code on GitHub → see the "view on github" link in the
header above, or replace it with the actual repository once this becomes a
real project.
