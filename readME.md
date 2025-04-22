
# Routside Kids News Guide

This project is a JavaScript-based application that processes and transforms news articles into a game-like narrative style inspired by the subreddit `/r/Outside`. It uses OpenAI embeddings and vector stores to manage and retrieve contextual data for generating responses.

## Features

- Fetches and processes news articles from external APIs.
- Converts news articles into a humorous, game-like format.
- Uses LangChain for document processing and vector storage.
- Supports memory-based and FAISS-based vector stores for efficient data retrieval.

## Technologies Used

- **JavaScript**: Core programming language.
- **LangChain**: For document loading, splitting, and vector storage.
- **Azure OpenAI**: For generating embeddings.
- **FAISS**: For efficient vector storage and retrieval.
- **Node.js**: Runtime environment.
- **npm**: Package manager.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have the required API keys and environment variables set up:
   - **Azure OpenAI API Key**: For generating embeddings.
   - **News API Key**: For fetching news articles.

4. Run the project:
   ```bash
   node server/test.js
   ```

## File Structure

- `server/test.js`: Main server-side script for creating and managing vector stores.
- `public/Routside_Kids_News_Guide.txt`: Text file used for document loading and processing.
- `package.json`: Contains project dependencies and scripts.

## Usage

1. Start the server by running the `test.js` script:
   ```bash
   node server/test.js
   ```

2. The script will:
   - Load the `Routside_Kids_News_Guide.txt` file.
   - Split the document into chunks.
   - Create a vector store using Azure OpenAI embeddings.
   - Save the vector store for future use.

3. Use the application to fetch news articles and transform them into `/r/Outside`-style narratives.

## Development Notes

- Ensure the `public/Routside_Kids_News_Guide.txt` file is present in the correct directory.
- Modify the `chunkSize` and `chunkOverlap` in the `RecursiveCharacterTextSplitter` configuration if needed for better document splitting.
- The FAISS vector store requires additional setup if not already installed.

## Future Improvements

- Add a front-end interface for user interaction.
- Implement error handling for API calls and file operations.
- Optimize vector store creation for larger datasets.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the subreddit `/r/Outside`.
- Built using LangChain and Azure OpenAI technologies.
