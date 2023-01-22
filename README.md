# Timeline

## Roadmap

- [x] Delete project
- [ ] Twitter integration
  - [x] Thread for ongoing events: next ongoing events continue the ongoing thread
  - [x] Use event title in tweet
  - [x] Date at project creation only if it is in the past.
  - [x] Final tweet
  - [x] Support events without description
  - [x] Support other title separators like "!"
  - [ ] Tweet images (twitter API v2 still doesn't support uploading media)
  - [x] Tweet link to image
  - [x] Tweet videos
  - [x] Confirm before tweet event
  - [x] Confirm before tweet project
- [x] Link to project and timelines from new project created screen
- [x] Add years to calendar
- [x] Create project with tags
- [x] Edit tag labels and types
- [x] Create event with video
- [x] Image gallery
- [x] Delete event confirmation screen
- [x] Delete project confirmation screen
- [x] Random project intros
- [x] Random event intros
- [x] Optimistic rendering
  - [x] Events
  - [x] Projects
  - [x] Tags
- [ ] Next.js cache invalidation on delete Object
- [ ] Instagram integration
- [ ] User page vs Projects page
  - [x] require authentication
  - [x] create user page
  - [ ] login page
  - [x] login with twitter
  - [ ] login with google
  - [ ] login with instagram
- [ ] OpenAi
  - [x] Project and event intros
  - [ ] Suggestions for next events
- [ ] UI v2
  - [ ] timeline calendar as a grid
  - [ ] simpler timelines calendar (zoomed out) that turn intro single timeline calendar on focus (zooming into the first event)
  - [ ] image gallery styles
- [ ] UI v3
  - [ ] Zoom in/out in timeline
  - [ ] Ongoing event relations in event cards

- Refactors:
  - [ ] EventCell
  - [ ] Extract EditModal from EventCell and EditProject
  - [ ] Clean env vars and how env vars are used in frontend

- Bugs:
  - [ ] on creating new event, the description sometimes is not set
  - [ ] after creating an event, the attributes are not set correct locally
  - [ ] after creating an ongoing event start, styles don't match
  - [ ] edit project date
  - [ ] after deleting a project, if user reloads page, it appears again
  - [ ] imgs in gallery are not seen (not using next/imag)
  - [ ] double image url on tweets
  - [ ] event title doesn't updates on the message to confirm tweet
