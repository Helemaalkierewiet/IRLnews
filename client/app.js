import { SystemMessage } from '@langchain/core/messages';

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector("form");
    console.log('form loated');
    let latestArticle = [];
    let isFetching = false;


    const fetchNews = async () => {
        const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=ddab06a06eeb49f7a7965bc7aee00d80&pageSize=1&page=1";

        try {
            const response = await fetch(url);
            console.log('await fetch is bereikt en ook doorgegaan.');

            if (response.ok) {
                const data = await response.json();
                console.log(data.articles[0].title);
                console.log('***********loggin ata.articles***********');

                let newArticle = {
                    title: `${data.articles[0].title}`,
                    description: `${data.articles[0].description}`,
                    content: `${data.articles[0].content}`,
                };

                latestArticle.push(newArticle);
                const article = latestArticle[0];
                console.log('ARRAY:', latestArticle);


            } else {
                let error = response.status;
                showResponse(error); // Gives the error code
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            showResponse('Something went wrong while fetching the news.');
        }
    };

    await fetchNews();
    const article = latestArticle[0];
    let messages = [
        {
            role: "system",
            content: `You are a narrator from the subreddit /r/Outside,
        which treats real life as an MMORPG.
        Take the following real-world news headline and convert it into a patch note,
        game mechanic change, or player event. Use humor and in-world lingo,
        referencing real-world regions like '[COUNTRY IN QUESTION] region' or '[CONTINENT IN QUESTION] server' where applicable.
        Format it like official game patch notes or event announcements. Or referencing to items, e.g. mobile phones as Pocket Communication device.

        You don't have to mention what region or country if you don't know it. When you don't know it:
        Decide if you want to say global server as location or to not mention it.

        You don't have to use all information from Headline, description, and content.
        Don't forget to make it real gamey.

        When generating the answer, stick to the provided context. When the answer is not
        present in the context, say this. Don't make stuff up.
        You can only use the following context: {context}

        Your job is to generate a new news article, narrated in /r/Outside style.
        The FORMAT of the news article has to be as follows:
        <h1>Title of the article</h1>
        <h3>Description of the article</h3>
        <h3>Content of the article</h3>
        
        latest news from another API:
        Title: ${article.title}
        Description: ${article.description}
        Content: ${article.content}
        
        If the user input is empty, use the latest news article as context.
        If the user input is in your opinion, not enough context, use the latest news article as context.
        If the user input is non-sensical, use the latest news article as context.
        If the user input is not in the context, use the latest news article as context.
        
        YOU CAN ONLY REPLY IN THIS FORMAT! YOU CAN EXTEND THE LENGTH OF TITLE, DESCRIPTION, AND CONTENT IN BETWEEN THE HTML ELEMENTS AS YOU SEE FIT! NEVER SAY YOU DON'T HAVE ENOUGH CONTEXT! FOR EXAMPLE: IF YOU ONLY HAVE THE TITLE CONTEXT, GAME-IFY THE TITLE.`
        }
    ];

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        await fetchNews();
        console.log('fetchnews is gelukt');


        console.log('defined messages:')
        console.log(messages);
        const chatfield = document.getElementById("chatfield");

        // Check if input is empty
        // if (!chatfield.value.trim()) {
        //     // alert("Please type something in the input field before submitting.");
        //     return;
        // }


        // push userPrompts to messages
        const userInput = chatfield.value.trim();
        if (userInput) {
            messages.push({role: "user", content: userInput});
        } else {
            console.error("User input is empty.");
        }
        // Call askQuestion only if input is valid
        askQuestion(e, messages);
    });

    console.log('outside function log article ARRAY:', latestArticle);


    async function askQuestion(e, messages) {


        // fetching isFetching logica
        if (isFetching) {
            console.log("Er is al een verzoek bezig. Wacht tot het is voltooid.");
            return; // Stop als er al een call bezig is
        }
        // fetching op true zodat isFetching niet nog een keer kan worden aangeroepen.
        isFetching = true;


        console.log("asking question");
        e.preventDefault();
        const chatfield = document.getElementById("chatfield");
        const mainbody = document.getElementById("mainbody");

        const responseElement = document.createElement("article");
        responseElement.innerHTML = "";
        mainbody.appendChild(responseElement);

        messages = messages.filter(
            (message) =>
                typeof message === "object" &&
                message.role &&
                typeof message.role === "string" &&
                message.content &&
                typeof message.content === "string" &&
                message.content.trim() !== ""
        );

        // Log the cleaned messages array for debugging
        console.log("Validated messages:", messages);


        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: chatfield.value,
                messages: messages
            })
        };

        // try = isfetching methos
        // ZORGT VOOR DAT JE NIET GELIJK NEIUWE KAN DOEN
        try {
            console.log('------------------------------options', options)

            const response = await fetch("http://localhost:3000/", options)
            console.log('await fetsh is bereikt en ook doorgegaan.')


            // als het niet ok is, toon errors (return dusniet l0g)
            if (!response.ok) {
                let error = response.status;
                console.log('error bij fetch versturen')
                return;
            } else {
                messages.push(["assistant", response])
            }


            // Reader stream logica, geen idee wat decoder is
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let fullText = "";
            responseElement.textContent = ""; // clean slate

            // voor altijd als er chunks ge"dript" worden (dit is logica uit de ReadableStream database/node?module?)
            while (true) {
                const {done, value} = await reader.read();
                // if klaar = break
                // (done wordt op true gezet als de response .end is!!!!
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});

                for (const char of chunk) {
                    fullText += char;
                    responseElement.textContent = fullText;
                    await new Promise(r => setTimeout(r, 10)); // ← perfect typewriter feel
                }
            }
            responseElement.innerHTML = fullText;
        } catch (error) {
            console.error("Fout tijdens het verwerken van de vraag:", error);
        } finally {
            isFetching = false; // Zet de vlag terug op false
        }
    }

// HTML render op het einde


    console.log('Javaskriptt is geladen GANG')
});

/*******************************
 ////////Form logic/////////
*******************************/




