import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

// const model = new AzureChatOpenAI({temperature: 1});

const embeddings = new AzureOpenAIEmbeddings();

// const vectordata = await embeddings.embedQuery("Hello world")
// console.log(vectordata)
// console.log(`Created vector with ${vectordata.length} values.`)

let vectorStore

async function createVectorstore() {
    const loader = new TextLoader("./public/Routside_Kids_News_Guide.txt");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`Document split into ${splitDocs.length} chunks. Now saving into vector store`);
    vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("vectordatabase");
}

createVectorstore();


