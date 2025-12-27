export type StreamEventType = "thinking" | "reasoning" | "agent_step" | "source" | "content" | "metadata" | "done" | "error";

export interface StreamEvent {
    type: StreamEventType;
    message?: string;
    step?: string;
    agent?: string;
    status?: "in_progress" | "completed";
    response?: string;
    source?: string;
    chunk?: string;
    full_response?: string;
    reasoning_steps?: string[];
    sources?: string[];
    tools_used?: string[];
}

export async function* streamChat(query: string, sessionId: string): AsyncGenerator<StreamEvent> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        console.error("NEXT_PUBLIC_API_BASE_URL is not defined! Check your .env.local file.");
    }

    const url = `${baseUrl || "http://localhost:8000"}/agentic/query/streaming`;
    console.log("Calling API at:", url);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query,
                session_id: sessionId,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const jsonStr = line.replace("data: ", "").trim();
                    if (!jsonStr) continue;

                    try {
                        const data = JSON.parse(jsonStr) as StreamEvent;
                        yield data;
                    } catch (e) {
                        console.error("Error parsing JSON:", jsonStr, e);
                    }
                }
            }
        }
    } catch (error) {
        yield { type: "error", message: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}
