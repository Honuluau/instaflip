# InstaFlip
InstaFlip is an experimental application solo-developed for Zach Henderson Library of Georgia Southern University. The application is a full-stack interface for any faculty/staff to manage patron's "flips". A "flip" is an action a patron can do where they can renew a laptop with no questions asked. A patron is allowed to "flip" 2 times a semester.

## Platforms
[![My Skills](https://skillicons.dev/icons?i=windows,apple)](https://skillicons.dev)

## Programming Languages and Frameworks
[![My Skills](https://skillicons.dev/icons?i=react,typescript,css,go,npm,sqlite)](https://skillicons.dev)

## Features
### Home Page
The home page features the "Flip Patron" section which is where a user will spend most of their time. A user should ask a patron to scan their EagleID while having the input box selected. InstaFlip will automatically return information about the patron's eligibility and a history of their flips. In this page, a user can flip a patron if they are eligible and remove previous flips if necessary. (Only for mistakes).

### Settings Page
Most features of InstaFlip are customizeable. This page features the ability to change the following:
- Current Semester's Date Range.
- Maximum amount of flips per semester.
- Export folder for Statistics.

### Statistics Page
The statistics page features two calendars where the user can export all of the information from the sqlite3 database within a certain timeframe.

### Debug Page
The debug page features a live-updating log of every action taken with the current InstaFlip process. This log can be downloaded which downloads straight to the user's home directory under ".instaflip/logs". A log is always downloaded upon InstaFlip's closing.
