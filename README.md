# Crate Dice

Roll a random Discogs release — filter by country, genre, decade, or year, and keep a history of every pick.

A tiny local web app that shows artwork + full metadata for each roll and stores history in your browser.

## Setup

1. `npm install`
2. Put your Discogs personal access token in `.env.local`:
   ```
   VITE_DISCOGS_TOKEN=your-token-here
   ```
   Get one at https://www.discogs.com/settings/developers.
3. `npm run dev` and open the URL it prints.

## Stack

Vite + React + TypeScript. No backend — the token lives in `.env.local` (git-ignored), and history is stored in `localStorage` with JSON export/import.

## Notes

- The Discogs search API caps results at 10 000; picks are drawn uniformly over that window.
- If you deploy this anywhere public, replace the `.env` token with a runtime prompt-and-store-in-localStorage flow so you don't leak it in the bundle.
