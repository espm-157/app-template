# Applications Module: Detailed Rubric

Total: 20 points

No single tool, library or path is required. A small app that does one thing well and is
carefully tested, documented and licensed can earn full marks. You are graded on the decisions
you make, how you check them, and how well a reader can use the result.

## 1. Interaction design (**5 points**)

**5 points**: The app lets a reader explore a question from one of the earlier modules.

  - It has at least two controls, such as dropdowns, sliders, checkboxes or map clicks, and
    each one changes what the reader sees in a way that matters for the question.
  - The app explains itself: a reader outside the class can tell what it shows and what to try
    without reading the README.
  - Figures and maps have labeled axes, units and legends, and the app says what the current
    view shows.

## 2. Data and correctness (**4 points**)

**4 points**: The app shows the data correctly.

  - Data are read from their original sources by URL, not from files downloaded by hand, or the
    design document explains why a copy was needed.
  - At least one view of the app has been checked against the notebook from the earlier module,
    and `design.md` says how.
  - The app handles the cases a reader will hit: missing values, a choice with no data, and slow
    loading.

## 3. Software practices (**5 points**)

**5 points**: The repository is something another person could maintain.

  - Every dependency is pinned to an exact version and listed in `design.md` with its purpose.
  - Tests in `tests/` check what the app does, beyond the starter tests, and pass on GitHub
    Actions. The badge in the README is green.
  - The repository has a `LICENSE` file, and `design.md` explains the choice of license and
    whether the data's license allows the app to use and redistribute it.
  - No keys or tokens are committed or included in the app.

## 4. Shipping (**3 points**)

**3 points**: A reader can use the app.

  - A web app is published on GitHub Pages and linked from the README. An installable, desktop
    or command-line app has install instructions that work for someone outside the team.
  - The app works on a phone screen and with a keyboard.

## 5. Process and GitHub (**3 points**)

**3 points**:

  - The repository includes your conversations with your coding agent, exported to `prompts/`.
    These show the guidance you gave the agent, including corrections and times you redirected
    it.
  - The README names the authors, describes the app, and ends with a short statement on AI use.
  - Commits show how the work developed, with clear messages.

## Failure conditions

The app fabricates data, or presents made-up or "example" numbers as if they came from the
sources. (Automatic fail)

This applies without change to output from a language model. Coding agents sometimes fill a
chart with placeholder data when a real source fails to load. Shipping that as real is the same
failure whether you typed it or accepted it.
