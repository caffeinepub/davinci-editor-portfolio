# DaVinci Editor Portfolio

## Current State
- VideoGallery shows 4 projects: Gaming Video Intro, Reel/Short, Colour Grading/Correction, Sound Design
- TechStack "Mastery In" has 4 cards: Editing, Fusion (VFX), Color, Sound Design
- AdminPanel lets user add/edit/delete projects by title + URL strings only (no file upload)

## Requested Changes (Diff)

### Add
- File/image upload support in AdminPanel so user can upload a thumbnail image and a video file directly (instead of pasting raw URLs). Use blob-storage for uploads and produce a URL from the upload result to save as thumbnailUrl/videoUrl.

### Modify
- VideoGallery: Remove "Reel / Short" and "Sound Design" from SAMPLE_PROJECTS, RE_CREATES set, COMING_SOON set, and DESCRIPTIONS. Only show: Gaming Video Intro (index 0, media-left) and Colour Grading/Correction (index 1, media-right).
- TechStack: Remove the Sound Design card from TOOLS array (keep Editing, Fusion VFX, Color). Remove Sound Design from SKILLS pills.
- AdminPanel: Replace plain URL inputs for thumbnailUrl and videoUrl with file upload inputs that call blob-storage. Show a small preview thumbnail if one is already set.

### Remove
- "Reel / Short" project entry everywhere
- "Sound Design" project entry everywhere
- Sound Design card from Mastery In section
- Sound Design from Proficiencies pills

## Implementation Plan
1. Update VideoGallery.tsx: trim SAMPLE_PROJECTS to 2 entries, update RE_CREATES and DESCRIPTIONS.
2. Update TechStack.tsx: remove Sound Design from TOOLS and SKILLS arrays.
3. Update AdminPanel.tsx: add file upload inputs using blob-storage StorageClient for thumbnail and video; show preview of existing thumbnail.
