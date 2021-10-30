## Purpose

This project was completed as part of a group learning exercise. As a result of completing this project I wanted to have a better understanding of some of the newer React features.

I also wanted to try out the API provided by Supabase, where I was able to take the opportunity to write a basic cache to reduce API requests.

## Demo

[https://youthful-elion-4abceb.netlify.app](https://youthful-elion-4abceb.netlify.app)

## Project Features

- User can create new notes using a rich text editor
- User can view, edit and delete existing notes
- User can edit a note and retain changes locally
- User can order the notes in the list with drag and drop

This video provides a quick walkthrough of the features. "Slow 3G" network throttling is turned on for this demo.

https://user-images.githubusercontent.com/14803/139520108-5a310347-6957-461b-b453-17fd0b09c94d.mp4

[YouTube Version](https://www.youtube.com/watch?v=4HkSNPDgAzo)

## Technical Specifications

- react@next using Suspense for data fetching
- Basic in memory cache to avoid unnecessary API calls
- react-router@next using the new routing API
- react-dnd for Dragging and Dropping the notes in the list
- TypeScript, which usually gets in the way for quick projects like this

### Dependencies

- The editor uses [Draft.js](https://draftjs.org/) for the rich text editing.
- The backend is built using [Supabase](https://supabase.io/) it provides a single `notes` table.
- The application uses [React Router](https://reactrouter.com/) for navigation state.
- Drag and drop is a pain when using the platform API, but [React-dnd](https://react-dnd.github.io/react-dnd/about) provides a pretty good abstraction.

### State Management

Supabase has been around for a little while and I have been curious about how well it integrates with React. It isn't as simple as making API calls, when building a React application it is important to consider client side caching.

This project has been designed to minimize the number of requests to a server. When the app is loaded a single request is made to Supabase for the list of notes.

```
supabase
    .from("notes")
    .select("id, title, summary, created_at")
    .order("created_at", { ascending: false })
```

This request does not contain all of the data for each note, only the data required for the list of notes. This excludes the actual note content. When we select a note from the list another request is made that asks for the `content` for the selected note.

```
supabase.from("notes").select("content").match({ id });
```

We only request the data when we actually want to display it, we do not download any additional note `content` that we are not interesting in viewing or editing.

When these requests are made, the results are cached in a normalized cache in memory. Clicking to view a note that we already have the content for will result in a cache hit. It will not make a request to the server since it already has the content that we need to display.

What does note content look like? This:

```
{
  "blocks": [
    {
      "key": "3inis",
      "text": "This is text content, everything else is meta data.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ],
  "entityMap": {}
}
```

This is the format that Draft.js uses for the editor, and this data can get to be quite large when writing longer notes with a lot of formatting. For this reason we only fetch the data as it is required.

The benefits of this caching are a lot more clear if testing is done using [throttling](https://developer.chrome.com/docs/devtools/network/#throttle) to slow down the network connection.

### CSS

I used tailwind for this project due to it growing popularity. I have been thinking a lot about ideals with React compatible CSS. There were some great composition opportunities that I would like to explore even further.

One of the things I really liked about it was how easy it is to compose styles using the `classnames` library.

```
className={classnames(
  "w-8 h-8 flex flex-col mr-2 justify-center items-center",
  "border border-gray-300 hover:bg-gray-50",
  "rounded-md shadow-sm cursor-pointer select-none",
  props.classes,
  {
    "text-black bg-gray-100 border-gray-400": props.active,
    "text-gray-400 bg-white": !props.active,
  }
)}
```

This example contains different styles applied directly, I have broken them down into different categories (sizing, layout, color etc). The `props.classes` is a value being passed as a prop which contains one or more tailwind class. The last piece is the conditional which is similar to how we use classnames in general. With tailwind, the classes are already there, so composing becomes the main job.

### Local Storage

Even though the notes are stored in a database provided by Supabase there are some reasons to store data in local storage.

The drag and drop functionality will change the order of the cards, but that order is not saved to the db. The localStorage has a record called `notes:order` which contains a JSON array of note ids.

All changes to the editor state are synchronized to local storage. This allows us to leave a note half finished and return to it later. The content for each note that is currently edited is stored in the localStorage under `notes:${id}`. When a note is saved, this record is removed from the localStorage and is only created again when the user edits the note.

### Incomplete

- Loading states cause a flash of the loading indicator on faster sites because I am not configuring suspense with useTransition.
- Saving and deleting states don't show a saving or deleting indicator.
- Styling, currently it isn't great on iPad. Even worse on iPhone.
- Missing error handling with ErrorBoundary for data loading.
- Definitely some bugs.
