## API Overview

Collection of information for movies, tv-shows, actors. Includes youtube trailer url, awards, full biography, and many other usefull informations. This api provides complete and updated data for over 9 million titles ( movies, series and episodes) and 11 million actors / crew and cast members

## Version

Unversioned (or no public version specified)

## Available Endpoints

1. Titles (Movies, Series, Episodes)
2. Series and Episodes
3. Actors and People
4. Utilities
5. Query Parameters (common across endpoints)

## Request and Response Format

🟦 1. Request Format
🔐 Authentication
API Key: Passed via headers

http

X-RapidAPI-Key: your-api-key
X-RapidAPI-Host: moviesdatabase.p.rapidapi.com

🧾 General GET Request Structure

http

GET https://moviesdatabase.p.rapidapi.com/titles
✅ Example with Query Parameters:

http

GET https://moviesdatabase.p.rapidapi.com/titles?genre=Action&year=2023&limit=10&page=1
✅ Full Example (Fetch Top Rated 250)

http

GET https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&limit=10
Headers:
  X-RapidAPI-Key: YOUR_API_KEY
  X-RapidAPI-Host: moviesdatabase.p.rapidapi.com

🟩 2. Response Format

✅ General Structure:
Every response is a JSON object and commonly includes a results key with an array of movie objects, and optional metadata like pagination.

Example Response (GET /titles):

json

{
  "results": [
    {
      "id": "tt1234567",
      "titleText": { "text": "Inception" },
      "primaryImage": {
        "url": "https://image-url.jpg",
        "caption": { "plainText": "Inception Poster" }
      },
      "releaseDate": { "year": 2010 },
      "ratingsSummary": {
        "averageRating": 8.8,
        "numVotes": 2000000
      },
      "genres": { "genres": [{ "text": "Action" }, { "text": "Sci-Fi" }] }
    }
  ],
  "page": 1,
  "next": 2,
  "entries": 250
}

🧪 3. Errors and Loading

🔴 Failed Response Example:

json

{
  "message": "Missing or invalid API Key",
  "statusCode": 401
}

🔁 Loading States:
Implement client-side logic to show a spinner or Loading.tsx component while awaiting this fetch.

💡 TypeScript Interface Example
For typing the title object:

ts

interface MovieTitle {
  id: string;
  titleText: { text: string };
  primaryImage?: {
    url: string;
    caption: { plainText: string };
  };
  releaseDate?: { year: number };
  ratingsSummary?: {
    averageRating: number;
    numVotes: number;
  };
  genres?: { genres: { text: string }[] };
}

## Authentication

To authenticate with the MoviesDatabase API, you must use API key authentication via headers.

✅ Required Headers
Include these headers in every request:

http

X-RapidAPI-Key: YOUR_API_KEY
X-RapidAPI-Host: moviesdatabase.p.rapidapi.com
Example in fetch (JavaScript/TypeScript):

ts

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_MOVIES_API_KEY!, // or use server-side env var
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
  },
};

fetch('https://moviesdatabase.p.rapidapi.com/titles', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

🔒 Best Practices for API Key Security
✅ Do not expose your API key in the frontend code.

🔁 Use Next.js API routes or server-side fetching (e.g. getServerSideProps or getStaticProps) to proxy requests.

🔐 Store the API key in a .env.local file:

bash

MOVIES_API_KEY=your_real_api_key_here
Example in Next.js API Route:

ts

// pages/api/fetch-movies.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles', {
    headers: {
      'X-RapidAPI-Key': process.env.MOVIES_API_KEY!,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}

## Error Handling

✅ 1. Server-Side Error Handling (API Route)
Example: pages/api/fetch-movies.ts

ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiResponse = await fetch("https://moviesdatabase.p.rapidapi.com/titles", {
      headers: {
        "X-RapidAPI-Key": process.env.MOVIES_API_KEY!,
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return res.status(apiResponse.status).json({
        error: true,
        message: errorData.message || "Failed to fetch data from MoviesDatabase API",
      });
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error while fetching movie data",
    });
  }
}

✅ 2. Client-Side Error Handling
Example React Hook:

ts

import { useState, useEffect } from "react";

export const useFetchMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/fetch-movies");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load movies.");
        }

        setMovies(data.results);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
};

✅ 3. Show Feedback in UI
Example Component:

tsx

{loading && <Loading />}
{error && <p className="text-red-500">{error}</p>}
{!loading && !error && movies.length === 0 && <p>No movies found.</p>}

✅ Additional Best Practices
Use try/catch for all async calls.

Always check HTTP status codes (res.ok, res.status).

Provide meaningful fallback UI for errors and empty data.

Log errors to the console or a monitoring service like Sentry.

## Usage Limits and Best Practices

✅ Usage Limits
While the API doesn’t publish strict rate limits directly, you should assume and prepare for these common constraints:

1. Rate Limiting
Limit requests to a reasonable number per minute (e.g., 30–60 RPM) to avoid throttling.

Implement debouncing on search inputs to reduce frequent calls:

ts

// Debounced search example (client-side)
const debouncedSearch = useDebounce(searchTerm, 500); // waits 500ms after last input

2. Pagination
Use pagination to limit the data per request.

The API supports:

page (default: 1)

limit (default: 10, max: 50)

ts

fetch(`/api/fetch-movies?page=2&limit=20`);

3. Client-Side Caching
Cache recent results using tools like swr, react-query, or simple in-memory caching.

Reduces unnecessary repeat calls for the same queries.

✅ Best Practices for Working with the API

🔒 Authentication & Security
Store the API key in a .env.local file and never expose it in the client.

Use a Next.js API route as a proxy between your frontend and the API.

⚙️ Efficiency
Only request necessary data using the info query param.

e.g., ?info=mini_info for basic data or ?info=base_info for more detail.

ts

fetch(`/api/fetch-movies?info=mini_info&limit=10&page=1`);

🚀 Performance Optimization
Use Next.js <Image /> component to optimize poster loading.

Avoid fetching large result sets at once.

Use lazy loading or infinite scroll for movie lists.

🧱 Code Structure
Use TypeScript interfaces to validate responses.

Create reusable components for MovieCard, MovieList, Pagination, etc.

💥 Error Resilience
Implement error boundaries.

Show user-friendly messages for API errors or when no results are found.

🧪 Development Checklist
 Use environment variables for API keys (.env.local)

 Implement loading and error states in UI

 Add search debouncing and pagination

 Use TypeScript interfaces for response models

 Apply caching for previously fetched queries

 Follow API rate limits to avoid throttling