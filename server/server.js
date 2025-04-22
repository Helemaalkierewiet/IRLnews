import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

import express from 'express'
import cors from 'cors'
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

let vectorStore;

const model = new AzureChatOpenAI({
    temperature:0.3,
    verbose: true,
});

const embeddings = new AzureOpenAIEmbeddings();
/**********************************
 // Defining app and cors, standaard torrie
     *****************************/




const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*********************
 ///////ROUTES////////
**********************/

app.get('/', async (req, res) => {
    const result = await tellJoke()
    res.json({
        message: result
    })
})

app.post('/', async (req, res) => {
    const prompt = req.body.prompt
    const messages = req.body.messages
    const newsArticle = await fetchNews();

    //voeg userPormpt toe aan history array. (die uit localstorage komt)


    console.log("Messages received:", messages); // Debugging log

    console.log(`user prompt: ${prompt}`);
    res.setHeader("Content-Type", "text/plain");

    const context = await contextGetter(prompt);
    await tellJoke(newsArticle, res, context, messages);
    res.end();
    // res.json({
    //     message: result
    // })
})

// ADA TORRIE
function readChunks(reader) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

async function contextGetter(userQuestion) {
    vectorStore = await FaissStore.load("vectordatabase", embeddings);

    // userVraag ->naar-> ADA.  // ADA scant document. // geeft chucnkcs ( al gemaakt in test.js)
    const relevantDocs = await vectorStore.similaritySearch(`${userQuestion}`,3);

    // Ik knoop chunkcs aan elkaar in variabele context
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // ik geef die chucnks mee aan chatgpt om als context te gebruiken voro het beantwoorden van de userVraag.+ prompt.
    // dus ik return uit dee functie
    return context;
}

async function tellJoke(newsArticle, res, context, startMessages) {
    // messages was here
    // const messages = [
    //         new SystemMessage(
    //             `You are a narrator from the subreddit /r/Outside,
    //          which treats real life as an MMORPG.
    //          Take the following real-world news headline and convert it into a patch note,
    //           game mechanic change, or player event. Use humor and in-world lingo,
    //            referencing real-world regions like '[COUNTRY IN QUESTION] region' or '[CONTINENT IN QUESTION] server' where applicable.
    //             Format it like official game patch notes or event announcements. Or referencing to items, e.g. mobile phones as Pocket Communication device.
    //
    //             You dont have to mention what region or country if u dont know it. When u dont know it:
    //             Decide if you want say global server as location or to not mention it.
    //
    //             You dont have to use all information from Headline, description and content.
    //             Don't forget to make it real gamey.
    //
    //             You get the latest news article in the following format:
    //             Title: ${newsArticle.title}
    //             Description: ${newsArticle.description}
    //             Content: ${newsArticle.content}
    //
    //             When generating the answer, stick to the provided context. When the anwser is not
    //             present in the context, say this. Don't make stuff up.
    //             you can only use the following context: ${context}
    //
    //             Your job is to generate a new news article, narrated in /r/Outside style.
    //             The FORMAT of the news article has to be as followed:
    //             <h1>Title of the article</h1>
    //             <h3>Description of the article</h3>
    //             <h3>Content of the article</h3>
    //
    //             YOU CAN ONLY REPLY IN THIS FORMAT!  YOU CAN EXTEND THE LENGHT OF TITLE DESCRIPTION AND CONTENT IN EBTWEEN THE HTML ELEMENTS AS YOU SEE FIT!
    //             `)
    //     ];

    // define messages die je mee hebt egrkegen vanaf de body vanaf app.js
    let messages = startMessages || "";

    console.log('MESSAGES:', messages);

    const joke = await model.stream(messages)
    for await (const chunk of joke) {
        console.log(chunk.content);
        res.write(chunk.content);
    }
    // return joke.content
}

let latestArticle = [];

const fetchNews = async () => {
    const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=ddab06a06eeb49f7a7965bc7aee00d80&pageSize=1&page=1";

    try {
        const response = await fetch(url);
        console.log('await fetch is bereikt en ook doorgegaan.');

        if (response.ok) {
            const data = await response.json();
            console.log(data.articles[0].title);
            console.log('***********loggin ata.articles***********');

            const newArticle = {
                title: `${data.articles[0].title}`,
                description: `${data.articles[0].description}`,
                content: `${data.articles.content}`,
            };

            return newArticle;
            //
            // latestArticle.push(newArticle);
            // console.log('ARRAY:',latestArticle);



        } else {
            let error = response.status;
            showResponse(error); // Gives the error code
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showResponse('Something went wrong while fetching the news.');
    }
};








app.listen(3000, () => console.log(`Server running on http://localhost:3000`))



/***
 messages.push(["human", "what do you mean by that?"])
 localStorage.setItem("myChatHistory", JSON.stringify(messages))

 import { HumanMessage, SystemMessage, AIMessage } from "langchain/chat_models/messages"

 const messages = [
     new SystemMessage("You're a helpful assistant"),
     new HumanMessage("What is the purpose of studying AI?"),
     new AIMessage("It will help you create smarter apps"),
     new HumanMessage("Does that mean I can let AI do all the work?"),
 ]


 // let message = [];
     messages.push(new HumanMessage("Hallo i'm OG"))

 // messages.push(["new Humanmessage, userinput/newsArticle]);
 // messages.push(["new Humanmessage, userinput/newsArticle]);
// set localstorage jsonifynshit
 // of doet die dit al automatisch? maakt hij van "human" and "ai" als key al t juiste format?


 en waar zou ik dit neerzetten? Bij: model definition?





 **/