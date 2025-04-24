import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";

export async function azureWhisper(audiofile) {
    console.log(audiofile);
    console.log(import.meta.env.VITE_AZURE_OPENAI_API_KEY)
    const loader = new OpenAIWhisperAudio('/audiogang.mp3', {
        transcriptionCreateParams: { language: "en" },
        clientOptions: {
            apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
            baseURL: `https://${import.meta.env.VITE_AZURE_OPENAI_API_INSTANCE_NAME}.openai.azure.com/openai/deployments/deploy-whisper`,
            defaultQuery: { 'api-version': import.meta.env.VITE_AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': import.meta.env.VITE_AZURE_OPENAI_API_KEY },
            dangerouslyAllowBrowser: true,
        },
    });

    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents from ${audiofile}`);
    console.log(docs)
    console.log(docs[0].pageContent);

    return docs[0].pageContent;
}
