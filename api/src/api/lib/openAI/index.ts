// Packages
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
// Utils
import { callout } from "../../utils/helpers";
// Types
import { Report } from "../../components/reports/types";
type History = [
    string | undefined,
    string | undefined
];
// Helpers
import { log } from '../../utils';
// Setup our config for OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_API_PATH
});
// Connect to OpenAI
const openai = new OpenAIApi(configuration);
// Chat model
const model: string = process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo';
// Chat initialization
const intro: string = `
    When reporting on sensitive data respond with a JSON object with the following fields
    - content: string

    If you can't come up with a report, respond in the same JSON format.
    Use the content property to output your response.

    Report Requirements:

    The report should include the following sections:

    1. Summary of the Breach
    Briefly describe the incident and the total number of compromised files.
    2. Details of Compromised Files
    Provide a breakdown of the number and type of sensitive information compromised.
    Describe the potential risk associated with each type of sensitive information.
    3. Impact Assessment
    Assess the potential impact of the breach on affected individuals based on the type of information compromised.
    4. Recommended Actions
    Suggest immediate steps to mitigate the impact of the breach.
    Provide recommendations for improving security and preventing future incidents.
    5. Conclusion
    Summarize the overall impact of the breach and the importance of the recommended actions.
    Important: The response should only include the structured report as requested above, with no additional commentary or information.
`;
//Class representing OpenAI
class OpenAI {
    // Conversations historical cache
    history: History[] = [];
    /**
     * Handle all requests after initialization using the historical context
     * 
     * @param {string} content - Content to review
     *
     * @return {Promise<Review>} Promise that resolves a review
     *
     * @example
     *
     *     await openAIChat(content);
     */
    async chat (content: string): Promise<string> {
        // Check if the history as been initialized
        if (!this.history.length) await this.init();
        // Define out messages store
        const messages: ChatCompletionRequestMessage[] = [];
        // Store out historical conversation in messages
        messages.push(
            { role: "user", content: this.history[0][0] },
            { role: "assistant", content: this.history[0][1] },
            { role: "user", content }
        );
        // Send message to bot
        const completion = await openai.createChatCompletion({
            model,
            messages
        });
        // Retrieve response from bot
        const completionString: string = completion.data.choices[0].message?.content ?? '';
        const res = JSON.parse(completionString);
        // Add to the historical conversation
        this.history.push([content, completionString]);
        // Review we'd like to return
        return res.content;
    }
    /**
     * Initializes chat context and sets the rules of engagement
     *
     * @return {Promise<void>} Promise that resolves nothing
     *
     * @example
     *
     *     await this.init();
     */
    // Initialize the conversation when the server starts
    private async init (): Promise<void> {
        const messages: ChatCompletionRequestMessage[] = [
            { role: "user", content: intro }
        ];

        const [err, completion] = await callout(openai.createChatCompletion({
            model,
            messages
        }));
        // Handle Errors
        if (err) {
            console.error(err.status, err.message);
        }

        this.history.push([intro, completion?.data?.choices[0].message?.content]);
        log('ChatGPT: Initialized');
    }
}
// Expose OpenAI class
export default new OpenAI();
