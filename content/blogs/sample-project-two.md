# Sample Project Two

Another **placeholder** post, this time pretending to describe a small
Kotlin service exploring distributed-systems ideas. Replace this file's
contents — `content/blogs/sample-project-two.md` — with real prose whenever
this becomes an actual project.

The premise: a toy service that partitions work across a few worker nodes,
coordinates through a lightweight leader-election scheme, and demonstrates
idempotent retries when a worker drops mid-task.

## Highlights

- Leader election using a simple lease-based protocol
- Idempotent task handoff so retries never double-process work
- Backpressure-aware worker pool sized to available cores
- Metrics exported in a Prometheus-friendly format

## How it works

Each worker registers a heartbeat lease; if the leader's lease expires,
another worker takes over coordination duties. A trimmed-down sketch:

```kotlin
class LeaderLease(private val ttlMs: Long) {
    private var expiresAt = 0L

    fun renew() {
        expiresAt = System.currentTimeMillis() + ttlMs
    }

    fun isExpired(): Boolean = System.currentTimeMillis() > expiresAt
}
```

> This is placeholder text. Swap it for real architectural notes, diagrams,
> or trade-offs once there's an actual project behind this slug.

## Links

Find the source on GitHub → see the "view on github" link in the header
above.
